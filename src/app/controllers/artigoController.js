const artigoModule = {};
const fs = require('fs');
let stopWords = require('../../resources/armazenamento/stopwords.json');
const Dictionary = require('../../resources/armazenamento/dictionary.json') || [];
const Documents = require('../../resources/armazenamento/documents.json') || [];
const Utils = require('../utils/utils');


function generateTermFrequency(resumo) {
    let array = normalizeText(resumo.toLowerCase()).split(/\s+/), countArray = {}, objectReturn = [];
    array.forEach(function (i) {
        countArray[i] = (countArray[i] || 0) + 1;
    });

    /** Não tem update, pois só gera-se ao inserir **/
    for (let key in countArray) {
        if (stopWords.indexOf(key) === -1)
            objectReturn.push({termo: key, quantidade: countArray[key]});
    }
    return objectReturn;
}

function dictionaryAddTerms(termFrequency) {
    let objectReturn = Dictionary || [];
    termFrequency.forEach(function (item) {
        let indexTerm = Dictionary.findIndex(x => x.termo === item.termo);
        if (indexTerm === -1)
            objectReturn.push({termo: item.termo, quantidade: item.quantidade, docs: 1});
        else {
            objectReturn[indexTerm].quantidade++;
            objectReturn[indexTerm].docs++;
        }

    });
    return objectReturn;
}
//DocId,título, autor, total-de-termos-significativos
function documentsAddReg(countTermFrequency, artigo) {
    let objectReturn = Documents || [], indexDoc = Documents.findIndex(x => x.titulo === artigo.titulo);
    if (indexDoc === -1)
        objectReturn.push({
            docId: Documents.length,
            titulo: artigo.titulo,
            autor: artigo.autor,
            totalTermosSignificativos: countTermFrequency,
            link: artigo.link,
        });
    else
        objectReturn[indexDoc] = {
            docId: objectReturn[indexDoc].docId,
            titulo: artigo.titulo,
            autor: artigo.autor,
            totalTermosSignificativos: countTermFrequency,
            link: artigo.link
        };
    return objectReturn;
}


function normalizeText(string) {
    string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    return string.replace(/\r?\n|\r/g, ' ');
}

/** Calculo Similaridade **/
function normalizeSearchUser(consulta) {
    let array = normalizeText(consulta.toLowerCase()).split(/\s+/);

    /** Removendo repetições **/
    array = [...new Set(array)];

    console.info('Busca User', array);
    array.forEach(function (item, key) {
        if (stopWords.indexOf(item) !== -1)
            array.splice(key, 1);
    });
    return array;
}

artigoModule.create = async (req, res) => {
    let path = process.cwd() + '/src/resources/armazenamento/';
    const {artigo} = req.body;

    let termFrequency = generateTermFrequency(artigo.resumo);
    let dataContentDictionary = dictionaryAddTerms(termFrequency);
    let dataContentDocumenstReg = documentsAddReg(termFrequency.length, artigo);
    try {
        await Promise.all([
            Utils.writeFile(JSON.stringify(artigo, null, 4), path + 'baseFiles/' + artigo.titulo + '.json', fs),
            Utils.writeFile(JSON.stringify(termFrequency, null, 4), path + 'termFrequency/' + artigo.titulo + '.json', fs),
            Utils.writeFile(JSON.stringify(dataContentDictionary, null, 4), path + 'dictionary.json', fs),
            Utils.writeFile(JSON.stringify(dataContentDocumenstReg, null, 4), path + 'documents.json', fs)
        ]);

        return res.send({ok: 'OK'});
    } catch (err) {
        console.log(err);
        return res.status(400).send({error: 'Registration failed'});
    }
};

/**
 * IDF
 * Para cada palavra pesquisada
 * log(30/NumeroDeDocumentosContemPalavra) base 2
 *
 **/
function calcularIDF(palavrasConsulta) {
    let indexTerm, idfTermosPesquisa = [];
    palavrasConsulta.forEach((item, key) => {
        indexTerm = Dictionary.findIndex(x => x.termo === item);
        idfTermosPesquisa[key] = (indexTerm !== -1 && Dictionary[indexTerm].docs)
            ? Math.log2(Documents.length / Dictionary[indexTerm].docs)
            : 0
    });

    return idfTermosPesquisa;
}

/**
 * TF
 * para cada palavra por documento matriz[termo][documento]
 * 1 + log(frequenciaTermoNoDocumento)
 **/
function calcularTF(palavrasConsulta) {
    let matrizTF = [];

    Documents.forEach((doc, keyD) => {
        let articleF = require('../../resources/armazenamento/termFrequency/' + doc.titulo + '.json');
        matrizTF[keyD] = [];
        palavrasConsulta.forEach((item, keyP) => {
            let indexTerm = articleF.findIndex(x => x.termo === item);
            matrizTF[keyD][keyP] = ( indexTerm !== -1)
                ? 1 + Math.log2(articleF[indexTerm].quantidade)
                : 0;
        });
    });

    return matrizTF;
}

/** tf * Idf **/
function calcularTF_IDF(idfs, tfs) {
    let arrayTFIF = [];
    tfs.forEach((tf, keyTF) => {
        arrayTFIF[keyTF] = [];
        idfs.forEach((idf, keyIDF) => {
            arrayTFIF[keyTF][keyIDF] = idf * tf[keyIDF]
        })
    });

    return arrayTFIF;
}

/**
 * Como alguns documentos podem não conter nenhum dos termos
 * Seu Score vai automaticamente para 0 (evita-se erro de divisão por 0)
 * **/
function calcularSimilaridade(TF_IDF_Matriz, arrayNormas) {
    let arrayScore = [];
    TF_IDF_Matriz.forEach((tfIdf, key) => {
        arrayScore[key] = 0;
        tfIdf.forEach((valor, key2) => {
            arrayScore[key] += (arrayNormas[key] !== 0)
                ? valor / arrayNormas[key]
                : 0;
        })
    });
    return arrayScore;
}


/** idfs(Wjq)
 * Recebe o array IDF
 * Retorna o somatorio das linhas ao quadrado
 * Calculado uma vez por consulta
 * **/
function calcularSomaNormaJQ(idfs) {
    let somaJQ = 0;
    idfs.forEach((idf) => {
        somaJQ += Math.pow(idf, 2);
    });

    return somaJQ;
}
/** W(ij)
 * Recebe a matriz TF
 * Retorna um array com o somatorio das linhas ao quadrado
 * **/
function calcularSomatorioNormaIJ(matrizTF) {
    let arrayIJ = [];
    matrizTF.forEach((tfIdf, key) => {
        arrayIJ[key] = 0;
        tfIdf.forEach((valor, key2) => {
            arrayIJ[key] += Math.pow(valor, 2);
        })
    });
    return arrayIJ;
}

/**
 * W(jq) Raiz do Somatorio dos idfs(Wiq) ao quadrado (da busca)
 * W(ij) Raiz do Somatorio dos idfs ao quadrado
 **/
function calcularNorma(idfs, matrizTF) {

    let somaJQ = calcularSomaNormaJQ(idfs),
        arraySomatorioIJ = calcularSomatorioNormaIJ(matrizTF),
        arrayNorma = [];

    arraySomatorioIJ.forEach((ij, keyTF) => {
        arrayNorma[keyTF] = Math.sqrt(ij) * Math.sqrt(somaJQ);
    });

    return arrayNorma;
}

artigoModule.search = async (req, res) => {
    let {consulta} = req.body;

    try {

        consulta = normalizeSearchUser(consulta);
        let DocumentsCopy = JSON.parse(JSON.stringify(Documents));

        /** Calculo Similaridade **/
        let IDF = calcularIDF(consulta), TF = calcularTF(consulta);
        let matrizTF_IDF = calcularTF_IDF(IDF, TF);
        let arrayNormas = calcularNorma(IDF, TF);

        let similaridade = calcularSimilaridade(matrizTF_IDF, arrayNormas);


        for (let doc in DocumentsCopy) {
            DocumentsCopy[doc].score = similaridade[doc];
        }


        let documentsReturn = [];
        DocumentsCopy.forEach((val, key) => {
            if (val.score > 0)
                documentsReturn.push(val)
        });

        console.log('Similaridade: ', similaridade);

        if (documentsReturn && documentsReturn.length) {
            /** Ordenando Via Score **/
            documentsReturn.sort(function (a, b) {
                let x = a.score;
                let y = b.score;
                return x < y ? 1 : x > y ? -1 : 0;
            });
        } else
            documentsReturn = [];


        return res.send(documentsReturn);
    } catch (err) {
        console.log(err);
        return res.status(400).send({error: 'List failed'});
    }
};

artigoModule.suggestSearch = async (req, res) => {

    try {
        let dictionaryCopy = JSON.parse(JSON.stringify(Dictionary));
        /** Ordenando mais frequentes **/
        dictionaryCopy.sort(function (a, b) {
            let x = a.quantidade;
            let y = b.quantidade;
            return x < y ? 1 : x > y ? -1 : 0;
        });

        /** Dez mais frequentes **/
        dictionaryCopy = dictionaryCopy.slice(0, 9);

        res.send(dictionaryCopy)
    } catch (err) {
        console.log(err);
        return res.status(400).send({error: 'List failed'});
    }
};

module.exports = artigoModule;
