const artigoModule = {};
const fs = require('fs');
let stopWords = require ('../../resources/armazenamento/stopwords.json');
const Dictionary = require ('../../resources/armazenamento/dictionary.json') || [];
let Documents = require ('../../resources/armazenamento/documents.json') || [];
const Utils = require('../utils/utils');


function generateTermFrequency(resumo) {
     let array = normalizeText(resumo.toLowerCase()).split(" "), countArray = {}, objectReturn = [];
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
            objectReturn.push({termo:item.termo,quantidade:item.quantidade});
        else
            objectReturn[indexTerm].quantidade++;
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
            totalTermosSignificativos:countTermFrequency
        });
    else
        objectReturn[indexDoc] = {
            docId: objectReturn[indexDoc].docId,
            titulo: artigo.titulo,
            autor: artigo.autor,
            totalTermosSignificativos: countTermFrequency
        };
    return objectReturn;
}


function normalizeText(string) {
    string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
    return string.replace(/\r?\n|\r/g,' ');
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

module.exports = artigoModule;
