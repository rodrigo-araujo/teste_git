const json_file = './data2.json';
const exported_file = 'dados2.csv';

var dados = require(json_file)
var fs = require('fs');

var dataToWrite = `url, title, metaDescription, isLoaded, isGoogleAnalyticsObject, isGoogleAnalyticsFunc, isCharacterEncode, isMetaDescription, isDoctype, isTitle, isTitleEnoughLong, isH1, h1, isH1OnlyOne, isH2, linksCount, isTooEnoughLinks, internalNoFollowLinksCount, notOptimizedImagesCount, wordsCount, isContentEnoughLong, isViewport, isAmp, isNotIframe, brokenLinksCount, brokenImagesCount, grade`;

function iterate(item, index) {
  const data = {
    url: clean(item.url),
    title: clean(item.title),
    metaDescription: clean(item.metaDescription),
    isLoaded: clean(item.isLoaded),
    isGoogleAnalyticsObject: clean(item.isGoogleAnalyticsObject),
    isGoogleAnalyticsFunc: clean(item.isGoogleAnalyticsFunc),
    isCharacterEncode: clean(item.isCharacterEncode),
    isMetaDescription: clean(item.isMetaDescription),
    isDoctype: clean(item.isDoctype),
    isTitle: clean(item.isTitle),
    isTitleEnoughLong: clean(item.isTitleEnoughLong),
    isH1: clean(item.isH1),
    h1: clean(item.h1),
    isH1OnlyOne: clean(item.isH1OnlyOne),
    isH2: clean(item.isH2),
    linksCount: clean(item.linksCount),
    isTooEnoughLinks: clean(item.isTooEnoughLinks),
    internalNoFollowLinksCount: clean(item.internalNoFollowLinksCount),
    notOptimizedImagesCount: clean(item.notOptimizedImagesCount),
    wordsCount: clean(item.wordsCount),
    isContentEnoughLong: clean(item.isContentEnoughLong),
    isViewport: clean(item.isViewport),
    isAmp: clean(item.isAmp),
    isNotIframe: clean(item.isNotIframe),
    brokenLinksCount: clean(item.brokenLinksCount),
    brokenImagesCount: clean(item.brokenImagesCount)
  }
  
  let grade = calculateGrade(data);
  
  dataToWrite += `\n${data.url}, ${data.title}, ${data.metaDescription}, ${data.isLoaded}, ${data.isGoogleAnalyticsObject}, ${data.isGoogleAnalyticsFunc}, ${data.isCharacterEncode}, ${data.isMetaDescription}, ${data.isDoctype}, ${data.isTitle}, ${data.isTitleEnoughLong}, ${data.isH1}, ${data.h1}, ${data.isH1OnlyOne}, ${data.isH2}, ${data.linksCount}, ${data.isTooEnoughLinks}, ${data.internalNoFollowLinksCount}, ${data.notOptimizedImagesCount}, ${data.wordsCount}, ${data.isContentEnoughLong}, ${data.isViewport}, ${data.isAmp}, ${data.isNotIframe}, ${data.brokenLinksCount}, ${data.brokenImagesCount}, ${grade}`;
}

function calculateGrade(data) {
  return cumulativeItemsTotal(data) * mandatoryItemsFactor(data);
}

mandatoryItemsFactor = function(data) {
  const isTitleWeight = (data.isTitle ? 1 : 0);
  const isDoctypeWeight = (data.isDoctype ? 1 : 0);
  const isLoadedWeight = (data.isLoaded ? 1 : 0);

  return isTitleWeight * isDoctypeWeight * isLoadedWeight;
}

cumulativeItemsTotal = function(data) {
  const isGoogleAnalyticsObjectGrade = (data.isGoogleAnalyticsObject ? 4 : 0);
  const isCharacterEncodeGrade = (data.isCharacterEncode ? 1 : 0);
  const isMetaDescriptionGrade = (data.isMetaDescription ? 4 : 0);
  const metaDescriptionGrade = (data.metaDescription && data.metaDescription.split(' ').length.between(50, 200) ? 3 : 0);
  const titleGrade = (data.title && data.title.split(' ').length.between(3, 50) ? 3 : 0);
  const isH1Grade = (data.isH1 ? 4 : 0);
  const isH1OnlyOneGrade = (data.isH1OnlyOne ? 2 : 0);
  const isH2Grade = (data.isH2 ? 3 : 0);
  const linksCountGrade = (data.linksCount >= 5 ? 2 : 0);
  const notOptimizedImagesCountGrade = (data.notOptimizedImagesCount == 0 ? 1 : 0);
  const isViewportGrade = (data.isViewport ? 4 : 0);
  const isAmpGrade = (data.isAmp ? 2 : 0);
  const brokenImagesCountGrade = (data.brokenImagesCount == 0 ? 4 : 0);

  return isGoogleAnalyticsObjectGrade + isCharacterEncodeGrade + isMetaDescriptionGrade + metaDescriptionGrade + titleGrade
         + isH1Grade + isH1OnlyOneGrade + isH2Grade + linksCountGrade + notOptimizedImagesCountGrade + isViewportGrade
         + isAmpGrade + brokenImagesCountGrade;
}

Number.prototype.between = function(min, max) {
  return this >= min && this <= max;
}

function clean(data) {
  var cleaned_data = data;
  if (typeof(cleaned_data) == "string") {
    cleaned_data = cleaned_data.replace(/(\r\n|\n|\r)/gm, "")
    cleaned_data = cleaned_data.replace(/,/gm, "|||");
  }

  return cleaned_data;
}

dados.forEach(iterate);
fs.writeFile(exported_file, dataToWrite, 'utf8', function (err) {
  if (err) {
    console.log('Erro! ', err);
  } else{
    console.log('Salvo!');
  }
});