"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[18035],{3905:(t,e,n)=>{n.d(e,{Zo:()=>d,kt:()=>c});var a=n(67294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function p(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var o=a.createContext({}),u=function(t){var e=a.useContext(o),n=e;return t&&(n="function"==typeof t?t(e):p(p({},e),t)),n},d=function(t){var e=u(t.components);return a.createElement(o.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},k=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,l=t.originalType,o=t.parentName,d=i(t,["components","mdxType","originalType","parentName"]),k=u(n),c=r,s=k["".concat(o,".").concat(c)]||k[c]||m[c]||l;return n?a.createElement(s,p(p({ref:e},d),{},{components:n})):a.createElement(s,p({ref:e},d))}));function c(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=n.length,p=new Array(l);p[0]=k;var i={};for(var o in e)hasOwnProperty.call(e,o)&&(i[o]=e[o]);i.originalType=t,i.mdxType="string"==typeof t?t:r,p[1]=i;for(var u=2;u<l;u++)p[u]=n[u];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},60599:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>u,contentTitle:()=>i,default:()=>k,frontMatter:()=>p,metadata:()=>o,toc:()=>d});n(67294);var a=n(3905);function r(){return r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},r.apply(this,arguments)}function l(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}const p={sidebar_label:"PDFOptions"},i="PDFOptions interface",o={unversionedId:"api/puppeteer.pdfoptions",id:"version-20.7.0/api/puppeteer.pdfoptions",title:"PDFOptions interface",description:"Valid options to configure PDF generation via Page.pdf().",source:"@site/versioned_docs/version-20.7.0/api/puppeteer.pdfoptions.md",sourceDirName:"api",slug:"/api/puppeteer.pdfoptions",permalink:"/api/puppeteer.pdfoptions",draft:!1,tags:[],version:"20.7.0",frontMatter:{sidebar_label:"PDFOptions"},sidebar:"api",previous:{title:"PDFMargin",permalink:"/api/puppeteer.pdfmargin"},next:{title:"Permission",permalink:"/api/puppeteer.permission"}},u={},d=[{value:"Signature:",id:"signature",level:4},{value:"Properties",id:"properties",level:2}],m={toc:d};function k(t){var{components:e}=t,n=l(t,["components"]);return(0,a.kt)("wrapper",r({},m,n,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",r({},{id:"pdfoptions-interface"}),"PDFOptions interface"),(0,a.kt)("p",null,"Valid options to configure PDF generation via ",(0,a.kt)("a",r({parentName:"p"},{href:"/api/puppeteer.page.pdf"}),"Page.pdf()"),"."),(0,a.kt)("h4",r({},{id:"signature"}),"Signature:"),(0,a.kt)("pre",null,(0,a.kt)("code",r({parentName:"pre"},{className:"language-typescript"}),"export interface PDFOptions\n")),(0,a.kt)("h2",r({},{id:"properties"}),"Properties"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Property"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Modifiers"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Type"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Description"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Default"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"displayHeaderFooter"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"boolean"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Whether to show the header and footer."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"false"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"footerTemplate"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"HTML template for the print footer. Has the same constraints and support for special classes as ",(0,a.kt)("a",r({parentName:"td"},{href:"/api/puppeteer.pdfoptions"}),"PDFOptions.headerTemplate"),"."),(0,a.kt)("td",r({parentName:"tr"},{align:null}))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"format"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("a",r({parentName:"td"},{href:"/api/puppeteer.paperformat"}),"PaperFormat")),(0,a.kt)("td",r({parentName:"tr"},{align:null})),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"letter"),".")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"headerTemplate"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("p",null,"HTML template for the print header. Should be valid HTML with the following classes used to inject values into them:"),(0,a.kt)("p",null,"- ",(0,a.kt)("code",null,"date")," formatted print date"),(0,a.kt)("p",null,"- ",(0,a.kt)("code",null,"title")," document title"),(0,a.kt)("p",null,"- ",(0,a.kt)("code",null,"url")," document location"),(0,a.kt)("p",null,"- ",(0,a.kt)("code",null,"pageNumber")," current page number"),(0,a.kt)("p",null,"- ",(0,a.kt)("code",null,"totalPages")," total pages in the document")),(0,a.kt)("td",r({parentName:"tr"},{align:null}))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"height"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string ","|"," number"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Sets the height of paper. You can pass in a number or a string with a unit."),(0,a.kt)("td",r({parentName:"tr"},{align:null}))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"landscape"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"boolean"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Whether to print in landscape orientation."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"false"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"margin"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("a",r({parentName:"td"},{href:"/api/puppeteer.pdfmargin"}),"PDFMargin")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Set the PDF margins."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"undefined")," no margins are set.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"omitBackground"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"boolean"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Hides default white background and allows generating pdfs with transparency."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"false"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"pageRanges"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Paper ranges to print, e.g. ",(0,a.kt)("code",null,"1-5, 8, 11-13"),"."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"The empty string, which means all pages are printed.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"path"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"The path to save the file to."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"undefined"),", which means the PDF will not be written to disk.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"preferCSSPageSize"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"boolean"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Give any CSS ",(0,a.kt)("code",null,"@page")," size declared in the page priority over what is declared in the ",(0,a.kt)("code",null,"width")," or ",(0,a.kt)("code",null,"height")," or ",(0,a.kt)("code",null,"format")," option."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"false"),", which will scale the content to fit the paper size.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"printBackground"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"boolean"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Set to ",(0,a.kt)("code",null,"true")," to print background graphics."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"false"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"scale"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"number"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Scales the rendering of the web page. Amount must be between ",(0,a.kt)("code",null,"0.1")," and ",(0,a.kt)("code",null,"2"),"."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"1"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"timeout"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"number"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Timeout in milliseconds. Pass ",(0,a.kt)("code",null,"0")," to disable timeout."),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"30_000"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"width"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),(0,a.kt)("code",null,"optional")),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"string ","|"," number"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Sets the width of paper. You can pass in a number or a string with a unit."),(0,a.kt)("td",r({parentName:"tr"},{align:null}))))))}k.isMDXComponent=!0}}]);