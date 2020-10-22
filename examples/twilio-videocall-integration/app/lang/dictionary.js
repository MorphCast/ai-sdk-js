/* global LANG*/
import IT from './dictionary_it';
import EN from './dictionary_en';

const dic = LANG === "EN" ? EN : IT;
export default dic;
