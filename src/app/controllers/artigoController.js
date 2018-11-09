const artigoModule = {};
const fs = require('fs');
let stopWords = require ('../../resources/armazenamento/stopwords.json');
const Dictionary = require ('../../resources/armazenamento/dictionary.json') || [];
let Documents = require ('../../resources/armazenamento/documents.json') || [];
const Utils = require('../utils/utils');


function generateTermFrequency(resumo) {
     let array = normalizeText(resumo.toLowerCase()).split(/\s+/), countArray = {}, objectReturn = [];
      array.forEach(function(i) {
        countArray[i] = (countArray[i]||0) + 1;
      });

    for(let key in countArray){
      if(stopWords.indexOf(key) === -1)
        objectReturn.push({termo:key,quantidade:countArray[key]});
    }
     return objectReturn;
}

function dictionaryAddTerms(termFrequency) {
    let objectReturn = Dictionary || [];
    termFrequency.forEach(function(item) {
        let indexTerm = Dictionary.findIndex(x => x.termo === item.termo);
        if( indexTerm === -1)
            objectReturn.push({termo:item.termo,quantidade:item.quantidade,docs:1});
        else{
            objectReturn[indexTerm].quantidade++;
            objectReturn[indexTerm].docs++;
        }

    });
    return objectReturn;
}
//DocId,título, autor, total-de-termos-significativos
function documentsAddReg(countTermFrequency,artigo) {
    let objectReturn = Documents || [], indexDoc = Documents.findIndex(x => x.titulo === artigo.titulo);
    if(indexDoc === -1)
        objectReturn.push({
            docId:Documents.length,
            titulo:artigo.titulo,
            autor:artigo.autor,
            totalTermosSignificativos:countTermFrequency,
            link:artigo.link,
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
    string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
    return string.replace(/\r?\n|\r/g,' ');
}

/** Calculo Similaridade **/
function normalizeSearchUser(consulta) {
    let array = normalizeText(consulta.toLowerCase()).split(/\s+/);

    /** Removendo repetições **/
    array = [...new Set(array)];

    console.log(array)
    array.forEach(function(item,key) {
        if(stopWords.indexOf(item) !== -1)
            array.splice(key, 1);
    });
    return array;
}

artigoModule.create = async (req, res) =>{
    let path = process.cwd()+'/src/resources/armazenamento/';
    const { artigo } = req.body;

    let termFrequency = generateTermFrequency(artigo.resumo);
    let dataContentDictionary = dictionaryAddTerms(termFrequency);
    let dataContentDocumenstReg = documentsAddReg(termFrequency.length,artigo);
    try {
      await Promise.all([
          Utils.writeFile(JSON.stringify(artigo, null, 4),path+'baseFiles/'+artigo.titulo+'.json',fs),
          Utils.writeFile(JSON.stringify(termFrequency, null, 4),path+'termFrequency/'+artigo.titulo+'.json',fs),
          Utils.writeFile(JSON.stringify(dataContentDictionary, null, 4),path+'dictionary.json',fs),
          Utils.writeFile(JSON.stringify(dataContentDocumenstReg, null, 4),path+'documents.json',fs)
      ]);

      return res.send({ok:'OK'});
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
    }
};

/**
 * IDF
 * Para cada palavra pesquisada
 * log(30/NumeroDeDocumentosContemPalavra) base 2 (Dicionario) alterar inserção
 *
 **/
function calcularIDF(palavrasConsulta){
    let indexTerm, idfTermosPesquisa = [];
    palavrasConsulta.forEach((item,key)=>{
        indexTerm = Dictionary.findIndex(x => x.termo === item);
        idfTermosPesquisa[key] = (indexTerm !== -1 && Dictionary[indexTerm].docs)
            ? Math.log2(Documents.length/Dictionary[indexTerm].docs)
            :0
    });

    return idfTermosPesquisa;
}

/**
 * TF
 * para cada palavra por documento matriz[termo][documento]
 * 1 + log(frequenciaTermoNoDocumento)
 **/
function calcularTF(palavrasConsulta,frequenciaTermoDocumento){
    //let matrizTF[palavrasConsulta.length][Documents.length];
    palavrasConsulta.forEach((item,key)=>{
        palavrasConsulta.forEach((item,key)=>{

        })
    })
    return (frequenciaTermoDocumento !== 0)
        ? 1 + Math.log2(frequenciaTermoDocumento)
        :0;
}


function calcularTF_IDF(frequenciaTermoDocumento){
    //tf * Idf
}

artigoModule.search = async (req, res) => {
    let { consulta } = req.body;

    consulta = normalizeSearchUser(consulta);

    console.log(calcularIDF(consulta));




    try {

        return res.send(Documents);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
    }
};

module.exports = artigoModule;
