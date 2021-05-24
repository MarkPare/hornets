import fs from 'fs';
import {parse as qsParse} from 'qs';

export const CLASS_NAMES = {
  vespa_mandarinia: 'vespa_mandarinia',
  vespa_velutina: 'vespa_velutina',
  sphex_ichneumoneus: 'sphex_ichneumoneus',
  sphecius_speciosus: 'sphecius_speciosus',
  sphecius_grandis: 'sphecius_grandis',
  tremex_columba: 'tremex_columba',
}

export const getClassData = () => {
  return Object.keys(CLASS_NAMES).map(c => {
    return {
      name: c,
      nameFormatted: getName(c),
    }
  })
}

const NAME_MAPPING = {
  vespa_mandarinia: 'Asian giant hornet',
  vespa_velutina: 'Asian hornet',
  sphex_ichneumoneus: 'Great golden digger wasp',
  sphecius_speciosus: 'Eastern cicada killer',
  sphecius_grandis: 'Western cicada killer',
  tremex_columba: 'Pigeon tremex',
} as Record<string, string>

export const getName = (key: string): string => {
  return NAME_MAPPING[key] || 'Unknown'
}

export const getFileNameFromSrc = (src: string) => {
  return src.split('/static/media/')[1]
}

export const getClassNameFromFileName = (fileName: string) => {
  const name = fileName.split('-')[0];
  return name;
}

export function downloadObjectAsJson(exportObj: any, exportName: any){
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// NOTE: this won't work when run in a browser, but can
// be used when running via electron
export const saveFile = (data: any, path: any) => {
  fs.writeFile(path, JSON.stringify(data), (error: any) =>{
    console.log('saveFile', error)
  })
}

export const parseUrlForKey = (key: string, url: string): string | undefined => {
  const parsed = qsParse(url, {ignoreQueryPrefix: true});
  return parsed[key] as string | undefined;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
export const handlePaste = (event: any) => {
  const win = window as any;
  let paste = (event.clipboardData || win.clipboardData).getData('text');
  console.log('paste data', paste)
  paste = paste.toUpperCase();

  const selection = win.getSelection();
  if (!selection.rangeCount) return false;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(paste));

  event.preventDefault();
}

// https://javascript.plainenglish.io/how-to-find-the-caret-inside-a-contenteditable-element-955a5ad9bf81
export function getCaretCoordinates() {
  let x = 0;
  let y = 0;
  const win = window as any;
  const isSupported = typeof win.getSelection !== "undefined";
  if (isSupported) {
    const selection = win.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
}
