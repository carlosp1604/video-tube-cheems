import { NextPage } from 'next'
import styles from './PostPage.module.scss'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { Post } from '~/modules/Posts/Infrastructure/Components/Post/Post'
import {
  HtmlPageMetaContextProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaContextProps'
import { HtmlPageMeta } from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMeta'
import {
  HtmlPageMetaVideoService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaVideoService'
import { ReactElement, useEffect, useRef } from 'react'
import { PostCardGallery } from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import { MobileBanner } from '~/modules/Shared/Infrastructure/Components/ExoclickBanner/MobileBanner'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { SEOHelper } from '~/modules/Shared/Infrastructure/FrontEnd/SEOHelper'

export interface PostPageProps {
  post: PostComponentDto
  parsedDuration: string
  postEmbedUrl: string
  baseUrl: string
  postViewsNumber: number
  postLikes: number
  postDislikes: number
  postCommentsNumber: number
  relatedPosts: PostCardComponentDto[]
  htmlPageMetaContextProps: HtmlPageMetaContextProps
}

export const PostPage: NextPage<PostPageProps> = ({
  post,
  postEmbedUrl,
  parsedDuration,
  baseUrl,
  relatedPosts,
  postCommentsNumber,
  postViewsNumber,
  postLikes,
  postDislikes,
  htmlPageMetaContextProps,
}) => {
  const { t } = useTranslation('post_page')
  const locale = useRouter().locale ?? 'en'
  const firstClickRef = useRef(0)

  const description = SEOHelper.buildDescription(
    post.title,
    t,
    post.producer ? post.producer.name : '',
    post.actor ? post.actor.name : '',
    post.resolution
  )

  let popUnder: ReactElement | null = null

  if (process.env.NEXT_PUBLIC_POPUNDER_URL) {
    popUnder = (
      <Script
        type={ 'text/javascript' }
        src={ process.env.NEXT_PUBLIC_POPUNDER_URL }
        async={ true }
      />
    )
  }

  useEffect(() => {
    const clickHandler = () => {
      if (firstClickRef.current === 0 && process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL) {
        firstClickRef.current = 1
        const script1 = document.createElement('script')
        const script2 = document.createElement('script')

        script1.async = true
        script1.type = 'text/javascript'
        // eslint-disable-next-line max-len
        script1.textContent = '(function(){p3NEm[644268]=(function(){var O2=2;for(;O2 !== 9;){switch(O2){case 1:return globalThis;break;case 2:O2=typeof globalThis === \'\u006f\u0062\x6a\u0065\x63\u0074\'?1:5;break;case 5:var g_;try{var Q3=2;for(;Q3 !== 6;){switch(Q3){case 4:Q3=typeof dGesh === \'\u0075\x6e\u0064\x65\u0066\u0069\u006e\x65\u0064\'?3:9;break;case 9:delete g_[\'\x64\x47\x65\x73\x68\'];var e$=Object[\'\u0070\u0072\x6f\u0074\x6f\x74\x79\x70\u0065\'];delete e$[\'\u0072\u0061\x34\u0071\u005a\'];Q3=6;break;case 3:throw "";Q3=9;break;case 2:Object[\'\u0064\u0065\u0066\x69\u006e\x65\x50\x72\x6f\x70\x65\u0072\u0074\x79\'](Object[\'\x70\u0072\x6f\x74\x6f\u0074\u0079\x70\u0065\'],\'\u0072\x61\u0034\x71\x5a\',{\'\x67\u0065\u0074\':function(){return this;},\'\x63\u006f\x6e\x66\u0069\u0067\x75\u0072\u0061\x62\u006c\u0065\':true});g_=ra4qZ;g_[\'\u0064\u0047\x65\x73\x68\']=g_;Q3=4;break;}}}catch(r_){g_=window;}return g_;break;}}})();function p3NEm(){}p3NEm[477914]=p3NEm[644268];p3NEm[644268].P3jj=p3NEm;p3NEm[12292]="xO1";p3NEm[178673]=391;p3NEm[582085]=true;p3NEm[592627]=677;p3NEm[604571]=p3NEm[644268];p3NEm[488696]=p3NEm[644268];p3NEm[566190]=p3NEm[644268];return (function(){\'use strict\';var D,F;var b=\'\x63\u006c\';var Y=\'\x61\u0062\';var o=\'\u0064\u0065\x62\x75\x67\';var N=\'\u0074\x69\u006d\u0065\';var p=\'\u0064\x6f\u006d\u0061\x69\u006e\';var U=\'\x63\u006e\u0067\u0066\x67\';var H=\'\x65\x75\';var J=String[\'\u0066\x72\x6f\u006d\x43\u0068\x61\u0072\x43\u006f\u0064\u0065\'](122,102,103);var V=\'\u006c\u006f\u0061\u0064\x65\x64\';var u=\'\u0063\u006f\u0064\u0065\';var E=("")[\'\x63\x6f\u006e\u0063\u0061\x74\'](J)[\'\u0063\x6f\u006e\u0063\u0061\u0074\'](V);var k=(D={},D[2]=("")[\'\u0063\u006f\x6e\x63\u0061\x74\'](E,\'\u0070\u006f\u0070\u0075\u0070\'),D[9]=("")[\'\u0063\u006f\u006e\x63\u0061\x74\'](E,\'\u0062\u0061\x6e\u006e\x65\u0072\'),D[10]=("")[\'\u0063\x6f\u006e\u0063\x61\u0074\'](E,\'\x69\u006e\u0070\u0061\x67\x65\'),D);var v=("")[\'\x63\u006f\x6e\x63\x61\u0074\'](J)[\'\x63\x6f\x6e\x63\u0061\u0074\'](u)[\'\u0063\u006f\x6e\x63\x61\x74\'](V);var m=(F={},F[2]=("")[\'\x63\u006f\x6e\u0063\u0061\x74\'](v,\'\x6f\u006e\u0063\x6c\x69\x63\u006b\'),F[9]=("")[\'\x63\u006f\u006e\u0063\u0061\x74\'](v,\'\x62\x61\x6e\x6e\u0065\u0072\'),F[10]=("")[\'\u0063\x6f\u006e\u0063\x61\x74\'](v,\'\u0069\u006e\x70\u0061\u0067\u0065\'),F);var w=(\'\x5f\')[\'\u0063\u006f\u006e\x63\u0061\x74\'](b,\'\x5f\')[\'\x63\x6f\x6e\u0063\x61\u0074\'](Y,\'\x5f\')[\'\u0063\u006f\x6e\u0063\u0061\u0074\'](o,\'\u005f\')[\'\x63\x6f\x6e\x63\u0061\x74\'](N);var T=(\'\u005f\')[\'\u0063\u006f\x6e\x63\u0061\x74\'](b,\'\x5f\')[\'\x63\x6f\u006e\x63\x61\x74\'](Y,\'\u005f\')[\'\x63\x6f\u006e\x63\u0061\u0074\'](o,\'\x5f\')[\'\x63\u006f\x6e\x63\u0061\x74\'](p);var z=(\'\u005f\x5f\')[\'\u0063\u006f\u006e\u0063\x61\u0074\'](U);var G=(\'\x5f\u005f\')[\'\u0063\x6f\u006e\u0063\x61\x74\'](U,\'\x5f\u005f\')[\'\u0063\u006f\u006e\x63\x61\u0074\'](Y);var y=(\'\x5f\u005f\')[\'\x63\x6f\x6e\x63\u0061\x74\'](U,\'\u005f\x5f\')[\'\x63\x6f\x6e\u0063\x61\x74\'](H);var Q=[\'\u006f\x6f\',\'\u006b\x6b\',\'\u0061\x61\u0061\',\'\x6a\x6a\x6a\',\'\u0066\x65\u0077\x68\',\'\u0061\u0061\u0073\x68\',\'\u0071\x77\u0064\x68\x77\',\'\u0077\u0065\x67\u0077\x67\u0073\',\'\u0068\x6b\x69\u0069\x75\x79\u0072\',\'\x6e\x66\x67\u0072\x73\x74\u0064\u0068\'];function X(r4,R9){var b$=new RegExp(T + \'\x3d\x28\u005b\x61\x2d\x7a\x2e\x5d\x2b\u0029\x26\x3f\')[\'\u0065\u0078\x65\u0063\'](r4[\'\u006c\u006f\u0063\x61\x74\x69\u006f\u006e\'][\'\u0068\u0072\u0065\u0066\']);var P_=(b$ === null || b$ === void 0?void 0:b$[1])?b$[1]:null;if(R9 && P_){return R9[\'\u0072\x65\x70\u006c\x61\x63\x65\'](\'\u002e\x63\x6f\u006d\x2f\',(\'\u002e\')[\'\u0063\x6f\x6e\x63\x61\u0074\'](P_,\'\u002f\'));}if(R9){return R9;}return P_;}function O(M5){try{return JSON[\'\u0070\x61\x72\x73\x65\'](M5);}catch(o8){return null;}}function h(I6){return I6[\'\u0066\u0069\x6c\u0074\u0065\u0072\'](function(O_,y5,a_){return a_[\'\u0069\u006e\u0064\x65\x78\u004f\u0066\'](O_) === y5;});}function W(y2){if(y2 === void 0){y2=window;}try{y2[\'\u0064\x6f\x63\u0075\x6d\x65\u006e\x74\'][\'\u0063\x6f\x6f\u006b\u0069\x65\'];return y2[\'\u006e\x61\x76\x69\x67\u0061\x74\x6f\x72\'][\'\x63\x6f\x6f\u006b\u0069\x65\x45\u006e\u0061\x62\x6c\x65\x64\'];}catch(S4){return false;}}var S;(S={},S[0]=0,S[1]=1,S);function K1(D8){return Boolean(D8 && typeof D8 === \'\x6f\x62\x6a\x65\u0063\u0074\' && (s(D8,\'\x63\x61\u006d\u0070\u0061\x69\x67\x6e\u0049\x6d\x70\') || s(D8,\'\u006d\u0061\x74\x65\x72\u0069\x61\x6c\u0049\x6d\x70\')));}function f$(w0){return Boolean(w0 && typeof w0 === \'\u006f\u0062\u006a\x65\x63\x74\' && (s(w0,\'\u0063\u0061\x6d\x70\x61\u0069\u0067\x6e\x43\u006c\x69\x63\u006b\') || s(w0,\'\x6d\u0061\x74\u0065\u0072\x69\u0061\u006c\u0043\u006c\u0069\u0063\u006b\')));}function s(L6,A3){return Boolean((A3 in L6) && L6[A3] && typeof L6[A3] === \'\u006f\u0062\x6a\u0065\u0063\x74\' && (\'\u0069\u0064\' in L6[A3]));}function B(J1){try{var z5=[];Object[\'\u006b\x65\u0079\u0073\'](J1)[\'\x66\u006f\x72\u0045\u0061\x63\x68\'](function(v0){var d4=Number(v0);var Z9=J1[v0];for(var I2=0;I2 < 8;I2++){z5[\'\u0070\x75\u0073\x68\'](Z9 % 256);Z9>>=8;}for(var I2=0;I2 < 4;I2++){z5[\'\u0070\u0075\x73\x68\'](d4 % 256);d4>>=8;}});return encodeURIComponent(btoa(String[\'\u0066\x72\x6f\x6d\u0043\x6f\x64\x65\u0050\u006f\u0069\u006e\u0074\'][\'\x61\u0070\x70\x6c\u0079\'](String,z5[\'\x72\x65\x76\x65\x72\x73\x65\']())));}catch(Z8){return \'\';}}function r0(b9){try{var h6=atob(decodeURIComponent(b9));var K8={};for(var p1=0;p1 < h6[\'\u006c\u0065\u006e\u0067\u0074\u0068\'];p1+=12){var C$=Number(0);for(var c_=0;c_ < 4;c_++){C$<<=8;C$+=Number(h6[\'\x63\u006f\u0064\u0065\u0050\x6f\x69\u006e\u0074\u0041\x74\'](p1 + c_));}var V0=Number(0);for(var c_=4;c_ < 12;c_++){V0<<=8;V0+=Number(h6[\'\x63\u006f\x64\u0065\u0050\x6f\u0069\u006e\x74\u0041\x74\'](p1 + c_));}if(isNaN(C$) || isNaN(V0)){throw new Error(\'\x69\x6e\x76\x61\x6c\u0069\u0064\');}K8[C$]=V0;}return K8;}catch(s0){return {};}}var A=Date[\'\x55\u0054\x43\'](2020,5,3,5,0,0) / 1000;function m6(Y6,Q_){if(Q_ === 0){return Y6;}var i7=(Y6 - A) % Q_;return Y6 - i7;}function P(H6,Q1,i9){if(i9 || arguments[\'\x6c\u0065\u006e\x67\x74\x68\'] === 2)for(var w$=0,M_=Q1[\'\u006c\x65\u006e\u0067\u0074\u0068\'],S0;w$ < M_;w$++){if(S0 || !((w$ in Q1))){if(!S0)S0=Array[\'\u0070\x72\x6f\u0074\u006f\x74\x79\u0070\u0065\'][\'\x73\x6c\x69\x63\x65\'][\'\x63\x61\u006c\u006c\'](Q1,0,w$);S0[w$]=Q1[w$];}}return H6[\'\u0063\x6f\x6e\u0063\x61\u0074\'](S0 || Array[\'\x70\x72\u006f\x74\x6f\x74\x79\x70\x65\'][\'\u0073\u006c\x69\u0063\u0065\'][\'\x63\u0061\u006c\u006c\'](Q1));}typeof SuppressedError === \'\x66\u0075\x6e\x63\x74\u0069\u006f\u006e\'?SuppressedError:function(g2,L3,U0){var U5=new Error(U0);return (U5[\'\x6e\x61\x6d\x65\']=\'\x53\u0075\u0070\x70\x72\u0065\x73\u0073\x65\x64\u0045\u0072\x72\u006f\x72\',U5[\'\u0065\x72\u0072\x6f\u0072\']=g2,U5[\'\x73\x75\u0070\x70\x72\u0065\x73\x73\u0065\x64\']=L3,U5);};function f(m3,a1,Y1){if(!W()){return;}m3=(\'\u005f\x5f\x50\x50\u0055\u005f\')[\'\x63\u006f\x6e\x63\u0061\x74\'](m3);Y1=Y1 || ({});Y1[\'\x70\u0061\x74\x68\']=Y1[\'\u0070\u0061\u0074\u0068\'] || \'\x2f\';var k5=Y1[\'\x65\u0078\x70\u0069\u0072\x65\u0073\'];if(typeof k5 === \'\u006e\u0075\u006d\x62\u0065\x72\' && k5){var n4=new Date();n4[\'\u0073\u0065\x74\u0054\x69\x6d\u0065\'](n4[\'\x67\u0065\x74\x54\u0069\x6d\x65\']() + k5 * 1000);k5=Y1[\'\x65\x78\x70\x69\x72\x65\x73\']=n4;}if(k5 && typeof k5 === \'\u006f\x62\x6a\x65\x63\x74\' && k5[\'\x74\u006f\x55\x54\x43\u0053\x74\x72\u0069\u006e\u0067\']){Y1[\'\x65\x78\u0070\x69\x72\u0065\u0073\']=k5[\'\x74\x6f\x55\x54\u0043\x53\x74\x72\x69\x6e\x67\']();}a1=encodeURIComponent(a1);var v9=("")[\'\x63\u006f\x6e\x63\u0061\x74\'](m3,\'\u003d\')[\'\u0063\u006f\x6e\x63\x61\u0074\'](a1);for(var G7 in Y1){v9+=(\'\x3b\x20\')[\'\u0063\x6f\x6e\x63\x61\x74\'](G7);if(Y1[\'\u0068\x61\x73\x4f\u0077\x6e\x50\x72\x6f\u0070\x65\x72\u0074\u0079\'](G7)){var X$=Y1[G7];if(X$ !== true){v9+=(\'\x3d\')[\'\u0063\x6f\u006e\u0063\u0061\u0074\'](X$);}}}document[\'\u0063\x6f\u006f\x6b\x69\x65\']=v9;}function j0(X7){if(!W()){return;}X7=(\'\u005f\x5f\x50\x50\x55\x5f\')[\'\x63\u006f\x6e\u0063\u0061\x74\'](X7);var t5=new RegExp(\'\x28\x3f\x3a\u005e\x7c\x3b\u0020\x29\' + X7[\'\x72\x65\x70\u006c\x61\u0063\x65\'](/([\\.$?*|{}\\(\\)\\[\\]\\\\\\/\\+^])/g,\'\x5c\x24\x31\') + \'\u003d\x28\x5b\u005e\x3b\x5d\u002a\x29\')[\'\x65\u0078\u0065\x63\'](document[\'\x63\u006f\x6f\x6b\x69\u0065\']);return t5?decodeURIComponent(t5[1]):undefined;}function V6(F$){f(F$,\'\',{expires:-1});}var I=[\'\u0043\u0041\x43\',\'\u0043\u0041\u0049\',\'\u004d\u0054\u0043\',\'\u004d\x54\u0049\'];var R={freq:\'\x46\u0052\u0051\',time:\'\u0046\x52\u0054\'};var K=5000;(function(){function U$(){}Object[\'\x64\u0065\u0066\x69\x6e\x65\u0050\x72\x6f\u0070\x65\u0072\u0074\u0079\'](U$[\'\u0070\u0072\x6f\x74\x6f\u0074\x79\x70\u0065\'],\'\u006e\x6f\x77\u0049\u006e\x53\u0065\x63\x6f\x6e\x64\u0073\',{get:function(){return Math[\'\u0063\u0065\x69\u006c\'](Date[\'\u006e\u006f\u0077\']() / 1000);},enumerable:false,configurable:true});U$[\'\x70\x72\x6f\u0074\u006f\u0074\u0079\x70\u0065\'][\'\u0061\x64\x64\x49\x6d\x70\u0072\u0065\x73\u0073\u0069\x6f\x6e\x46\u0072\x65\u0071\x43\x61\x70\u0073\']=function(g9){if(g9[\'\u0063\x61\x6d\x70\u0061\x69\u0067\u006e\x49\x6d\x70\']){this[\'\u0073\x65\x74\x46\x72\u0065\x71\x43\u0061\x70\'](g9[\'\x63\x61\x6d\u0070\x61\u0069\x67\x6e\x49\u006d\x70\'],\'\x43\x41\x49\');}if(g9[\'\u006d\u0061\x74\u0065\x72\x69\x61\x6c\u0049\u006d\x70\']){this[\'\u0073\x65\x74\x46\u0072\x65\u0071\u0043\u0061\x70\'](g9[\'\x6d\u0061\u0074\u0065\u0072\u0069\x61\u006c\u0049\x6d\u0070\'],\'\u004d\u0054\u0049\');}};U$[\'\x70\x72\x6f\x74\x6f\x74\x79\u0070\u0065\'][\'\x61\u0064\x64\u0043\u006c\x69\u0063\x6b\x46\u0072\x65\x71\x43\x61\x70\x73\']=function(q3){if(q3[\'\u0063\u0061\x6d\u0070\u0061\x69\u0067\x6e\x43\x6c\u0069\x63\u006b\']){this[\'\x73\u0065\x74\x46\u0072\u0065\x71\u0043\x61\x70\'](q3[\'\x63\u0061\x6d\x70\x61\x69\u0067\x6e\u0043\u006c\x69\u0063\x6b\'],\'\x43\u0041\x43\');}if(q3[\'\x6d\x61\x74\x65\u0072\x69\x61\x6c\x43\x6c\u0069\x63\u006b\']){this[\'\x73\x65\x74\x46\u0072\x65\u0071\u0043\u0061\u0070\'](q3[\'\u006d\u0061\x74\x65\x72\x69\x61\u006c\u0043\x6c\u0069\x63\x6b\'],\'\u004d\x54\x43\');}};U$[\'\u0070\x72\u006f\u0074\u006f\x74\u0079\u0070\u0065\'][\'\x67\x65\u0074\x46\x72\x65\x71\x43\x61\u0070\u0073\']=function(){var V2=this;return I[\'\x72\u0065\x64\x75\x63\u0065\'](function(O9,k9){var V_=V2[\'\x67\x65\u0074\u0046\x72\u0065\u0071\u0043\x61\x70\u0044\u0061\x74\x61\'](k9);var R4=\'\x66\u0072\x65\u0071\';if(Object[\'\x6b\x65\u0079\u0073\'](V_[\'\x66\u0072\u0065\x71\'])[\'\u006c\x65\u006e\x67\x74\x68\'] > 0){O9[V2[\'\u0067\x65\x74\u0044\x61\x74\x61\x4b\u0065\x79\'](k9,R4)]=B(V_[R4]);}return O9;},{});};U$[\'\x70\u0072\u006f\x74\u006f\x74\x79\u0070\x65\'][\'\u0067\u0065\u0074\u0046\x72\x65\x71\u0043\x61\x70\u0073\x41\x73\u0050\u0061\x72\x61\x6d\u0073\']=function(){var O$=this[\'\u0067\x65\x74\u0046\x72\u0065\x71\u0043\x61\x70\u0073\']();return Object[\'\u006b\u0065\x79\x73\'](O$)[\'\u0072\u0065\x64\x75\x63\x65\'](function(r2,y0){return r2 + (O$[y0]?(\'\u0026\')[\'\x63\x6f\x6e\x63\x61\u0074\'](y0[\'\u0074\x6f\u004c\u006f\x77\u0065\x72\x43\x61\u0073\x65\'](),\'\x3d\')[\'\u0063\x6f\x6e\u0063\u0061\x74\'](O$[y0]):\'\');},\'\');};U$[\'\u0070\u0072\u006f\x74\x6f\x74\x79\x70\x65\'][\'\x61\x64\x64\u0046\u0072\u0065\x71\u0043\x61\u0070\u0073\x41\x73\x79\x6e\x63\']=function(A0,t2,o6){var E6=this;if(!t2[\'\x6c\x65\x6e\u0067\x74\u0068\']){return;}var s$=function(T5){if(T5[\'\x6f\x72\u0069\x67\x69\u006e\'] === t2){A0[\'\u0072\x65\x6d\x6f\u0076\u0065\x45\u0076\u0065\x6e\u0074\u004c\x69\x73\x74\x65\u006e\x65\x72\'](\'\x6d\x65\x73\u0073\x61\x67\u0065\',s$);if(T5[\'\x64\u0061\x74\u0061\']){var N7=O(T5[\'\x64\u0061\x74\u0061\']);if(o6 === \'\u0063\x6c\u0069\x63\u006b\' && N7 && f$(N7)){E6[\'\x61\u0064\u0064\x43\x6c\u0069\x63\x6b\u0046\x72\x65\u0071\x43\u0061\x70\u0073\'](N7);}if(o6 === \'\u0069\u006d\u0070\u0072\u0065\x73\x73\u0069\x6f\x6e\' && N7 && K1(N7)){E6[\'\x61\u0064\u0064\x49\u006d\x70\x72\u0065\x73\u0073\x69\x6f\u006e\u0046\u0072\x65\u0071\u0043\u0061\u0070\x73\'](N7);}}}};A0[\'\u0061\u0064\u0064\u0045\x76\u0065\u006e\x74\x4c\u0069\x73\u0074\x65\x6e\u0065\x72\'](\'\u006d\u0065\u0073\x73\u0061\u0067\u0065\',s$);A0[\'\x73\x65\u0074\u0054\u0069\u006d\x65\u006f\x75\u0074\'](function(){return A0[\'\u0072\x65\u006d\x6f\x76\u0065\u0045\u0076\x65\x6e\x74\x4c\x69\u0073\u0074\u0065\u006e\x65\u0072\'](\'\u006d\x65\x73\u0073\u0061\x67\x65\',s$);},K);};U$[\'\u0070\u0072\u006f\u0074\u006f\u0074\u0079\x70\u0065\'][\'\x73\u0065\x74\u0046\u0072\u0065\u0071\x43\x61\u0070\']=function(T7,H9){var C0;var M9=this[\'\x67\u0065\x74\x46\x72\u0065\u0071\x43\x61\x70\u0044\u0061\u0074\u0061\'](H9);if(!M9[\'\x74\x69\x6d\x65\'][T7[\'\x69\x64\']]){M9[\'\u0074\x69\u006d\u0065\'][T7[\'\x69\u0064\']]=m6(this[\'\u006e\x6f\x77\x49\u006e\u0053\u0065\u0063\x6f\u006e\x64\x73\'],T7[\'\x63\u0061\u0070\u0070\u0069\u006e\u0067\']) + T7[\'\x63\u0061\x70\x70\u0069\x6e\x67\'];}M9[\'\u0066\u0072\u0065\u0071\'][T7[\'\x69\u0064\']]=((C0=M9[\'\u0066\x72\x65\u0071\'][T7[\'\u0069\u0064\']]) !== null && C0 !== void 0?C0:0) + 1;this[\'\x73\x61\x76\u0065\u0054\x6f\u0053\x74\u006f\u0072\x65\'](H9,M9);};U$[\'\u0070\u0072\u006f\u0074\x6f\x74\x79\x70\u0065\'][\'\u0067\x65\u0074\u0046\u0072\u0065\x71\u0043\x61\u0070\u0044\u0061\u0074\u0061\']=function(f7){var L9=this[\'\x6e\u006f\u0077\x49\x6e\u0053\x65\x63\x6f\x6e\x64\x73\'];var W5=this[\'\u0067\x65\x74\x46\u0072\u006f\u006d\x53\x74\u006f\x72\u0065\'](f7);h(P(P([],Object[\'\u006b\x65\u0079\u0073\'](W5[\'\u0074\u0069\u006d\x65\']),true),Object[\'\u006b\u0065\u0079\x73\'](W5[\'\u0066\u0072\x65\x71\']),true))[\'\x66\x6f\x72\u0045\u0061\x63\x68\'](function(k0){if(!W5[\'\u0074\x69\x6d\x65\'][k0] || W5[\'\x74\x69\u006d\x65\'][k0] <= L9){delete W5[\'\x66\x72\u0065\x71\'][k0];delete W5[\'\u0074\u0069\u006d\u0065\'][k0];}});this[\'\x73\u0061\u0076\x65\x54\x6f\u0053\u0074\u006f\u0072\x65\'](f7,W5);return W5;};U$[\'\u0070\x72\x6f\x74\u006f\u0074\x79\x70\x65\'][\'\u0073\u0061\u0076\u0065\x54\u006f\x53\u0074\x6f\x72\u0065\']=function(w5,H$){var R3=this;Object[\'\u006b\x65\x79\x73\'](R)[\'\u0066\u006f\u0072\u0045\u0061\u0063\x68\'](function(Q8){var L5=R3[\'\x67\u0065\u0074\u0044\u0061\x74\u0061\x4b\u0065\x79\'](w5,Q8);if(Object[\'\u006b\x65\u0079\x73\'](H$[Q8])[\'\u006c\x65\u006e\x67\u0074\x68\']){f(L5,B(H$[Q8]));}else {V6(L5);}});};U$[\'\x70\x72\x6f\u0074\x6f\u0074\u0079\u0070\u0065\'][\'\u0067\u0065\x74\x46\u0072\u006f\x6d\x53\u0074\x6f\x72\u0065\']=function(u$){var Q5=this;return Object[\'\x6b\x65\x79\u0073\'](R)[\'\u0072\x65\u0064\x75\u0063\x65\'](function(S2,v4){var p6=j0(Q5[\'\x67\x65\x74\u0044\u0061\x74\u0061\x4b\x65\u0079\'](u$,v4));S2[v4]=p6?r0(p6):{};return S2;},{freq:{},time:{}});};U$[\'\u0070\x72\x6f\u0074\x6f\x74\x79\x70\u0065\'][\'\x67\x65\x74\u0044\x61\x74\u0061\u004b\x65\u0079\']=function(b6,y3){return b6 + R[y3];};return U$;})();var C=function(f9,S1){var v8=\'\';for(var Q7=0;Q7 < S1;Q7++){v8+=f9[\'\u0063\u0068\u0061\u0072\u0041\x74\'](Math[\'\u0066\u006c\x6f\u006f\x72\'](Math[\'\u0072\x61\x6e\u0064\x6f\x6d\']() * f9[\'\x6c\u0065\u006e\u0067\x74\u0068\']));}return v8;};function g(D6,r3){return Math[\'\x66\x6c\u006f\u006f\x72\'](Math[\'\u0072\x61\u006e\x64\u006f\u006d\']() * (r3 - D6 + 1)) + D6;}function M8(e_){var F2=e_ % 71387;return function(){return F2=(23251 * F2 + 12345) % 71387;};}var M=function(w3,O0){return (O0 + w3)[\'\u0073\u0070\u006c\x69\x74\'](\'\')[\'\x72\x65\x64\u0075\u0063\x65\'](function(t1,a6){return t1 * 31 + a6[\'\x63\x68\u0061\u0072\u0043\x6f\x64\x65\u0041\x74\'](0) & (1 << 25) - 1;},19);};function B0(T0){var q7=T0[\'\x73\u0070\x6c\x69\u0074\'](\'\u003f\'),k2=q7[0],u2=q7[1],z8=u2 === void 0?\'\':u2;var p0=k2[\'\u0072\x65\x70\x6c\u0061\x63\u0065\'](/^https?:\\/\\//,\'\')[\'\x73\u0070\x6c\u0069\x74\'](\'\x2f\'),s_=p0[0],O6=p0[\'\x73\u006c\x69\u0063\u0065\'](1);return {origin:k2,domain:s_,path:O6[\'\u006a\u006f\u0069\x6e\'](\'\u002f\'),search:z8};}function a7(A$){var C6;var V3=P([],A$,true);var R0=V3[\'\u006c\x65\x6e\u0067\x74\u0068\'];while(R0 !== 0){var s6=Math[\'\x66\u006c\x6f\u006f\x72\'](Math[\'\u0072\u0061\x6e\x64\x6f\x6d\']() * R0);R0--;(C6=[V3[s6],V3[R0]],V3[R0]=C6[0],V3[s6]=C6[1]);}return V3;}var r=function(){var K5=Q[g(0,Q[\'\x6c\x65\x6e\x67\u0074\x68\'] - 1)];var P1=Boolean(g(0,1));var z6=P1?g(1,999999):C(\'\u0061\u0062\u0063\u0064\u0065\x66\x67\u0068\u0069\x6a\u006b\u006c\x6d\u006e\u006f\x70\x71\u0072\x73\x74\u0075\x76\x77\x78\u0079\u007a\',g(2,6));return ("")[\'\u0063\u006f\u006e\u0063\x61\x74\'](K5,\'\x3d\')[\'\u0063\x6f\x6e\u0063\x61\x74\'](z6);};var q=function(j4,x_){var s4=[];var E9=g(j4,x_);for(var h$=0;h$ < E9;h$++){s4[\'\x70\u0075\u0073\x68\'](r());}return s4;};function a2(j8,s8){var n7=j8[\'\u0063\x68\u0061\x72\u0043\u006f\x64\x65\u0041\u0074\'](0);var g4=26;var p7=n7 < 97 || n7 > 122?n7:97 + (n7 - 97 + s8()) % g4;var g6=String[\'\u0066\x72\u006f\x6d\u0043\u0068\u0061\u0072\x43\x6f\x64\x65\'](p7);return g6 === \'\u0069\'?g6 + \'\u0069\':g6;}function E4(N5,q9,l1){var T$=M(N5,q9);var Z5=M8(T$);return l1[\'\u0073\x70\u006c\x69\x74\'](\'\')[\'\u006d\u0061\u0070\'](function(W2){return a2(W2,Z5);})[\'\x6a\x6f\x69\x6e\'](\'\');}function Z(o5,t3){o5=o5[\'\u0072\x65\u0070\u006c\u0061\u0063\x65\'](\'\x3f\x69\x64\x3d\' + t3 + \'\x26\',\'\u003f\')[\'\u0072\x65\x70\x6c\x61\x63\u0065\'](\'\u003f\x69\x64\x3d\' + t3,\'\u003f\')[\'\u0072\x65\u0070\u006c\x61\u0063\u0065\'](\'\x26\x69\x64\u003d\' + t3,\'\');var U1=B0(o5),C5=U1[\'\u0064\u006f\u006d\x61\u0069\u006e\'],X0=U1[\'\x73\x65\x61\u0072\x63\u0068\'],z7=U1[\'\u006f\x72\u0069\u0067\x69\x6e\'];var O4=X0?X0[\'\u0073\x70\x6c\x69\u0074\'](\'\x26\'):[];var f_=O4[\'\x6c\x65\u006e\u0067\u0074\u0068\'] > 4?[0,2]:[5,9];O4[\'\u0070\x75\u0073\x68\'][\'\x61\x70\u0070\x6c\u0079\'](O4,q[\'\u0061\u0070\u0070\x6c\u0079\'](void 0,f_));O4=a7(O4);var p5=E4(t3,C5,O4[\'\x6a\x6f\u0069\x6e\'](\'\x26\'));var h7=g(0,O4[\'\x6c\u0065\x6e\x67\x74\u0068\']);var L7=p5[\'\x73\x70\x6c\u0069\x74\'](\'\x26\');L7[\'\u0073\u0070\u006c\u0069\x63\x65\'](h7,0,(\'\u0069\x64\u003d\')[\'\u0063\x6f\x6e\u0063\x61\x74\'](t3));var b5=z7[\'\u0072\x65\x70\u006c\x61\u0063\x65\'](C5,C5 + \'\u002f\u0065\u006e\') + \'\u003f\' + L7[\'\x6a\u006f\x69\u006e\'](\'\u0026\');return b5;}function X5(G_){var H7=new RegExp(w + \'\u003d\u0028\x5c\u0064\x2b\x29\')[\'\x65\u0078\x65\u0063\'](G_[\'\u006c\x6f\u0063\x61\x74\u0069\x6f\x6e\'][\'\u0068\x72\u0065\u0066\']);if((H7 === null || H7 === void 0?void 0:H7[1]) && !isNaN(Number(H7[1]))){return Number(H7[1]);}return Date[\'\x6e\u006f\x77\']();}var a=[1,3,6,5,8,9,10,11,12,13];var L=(function(){function V1(n9,y1,I5,l6,m9,N2){this[\'\x77\u0069\x6e\']=n9;this[\'\x69\u0064\']=y1;this[\'\x74\x79\u0070\u0065\']=I5;this[\'\x62\x36\u0034\u0064\']=l6;this[\'\x76\x65\x72\']=m9;this[\'\u0066\x62\x76\']=N2;this[\'\u0074\x6d\u0072\']=null;this[\'\x77\x75\']=this[\'\u0069\u0077\u0061\']();this[\'\x69\u006e\x73\']();this[\'\u0063\x63\x6c\x74\']();this[\'\x77\u0069\x6e\'][this[\'\u0069\x64\'] + y]=Z;}V1[\'\x70\u0072\x6f\u0074\u006f\u0074\u0079\u0070\x65\'][\'\x69\x6e\']=function(){if(this[\'\x77\u0069\x6e\'][m[this[\'\u0074\u0079\x70\x65\']]] === true){return;}if(this[\'\u0074\x6d\u0072\']){this[\'\u0077\u0069\u006e\'][\'\u0063\x6c\x65\x61\u0072\x54\x69\x6d\x65\u006f\u0075\u0074\'](this[\'\u0074\x6d\u0072\']);}this[\'\u0061\u0073\x74\']();};V1[\'\u0070\u0072\x6f\x74\u006f\x74\u0079\u0070\x65\'][\'\u0069\u006e\u0073\']=function(){var E8=this;var x6=a[\'\u006d\u0061\u0070\'](function(v3){return E8[\'\x67\x64\'](v3);});Promise[\'\u0061\x6c\u006c\'](x6)[\'\u0074\x68\x65\x6e\'](function(K3){E8[\'\u0077\x69\u006e\'][E8[\'\x67\x63\u0075\x6b\']()]=K3;});};V1[\'\x70\x72\x6f\x74\x6f\u0074\x79\x70\u0065\'][\'\x63\x63\u006c\x74\']=function(){var P2=this;this[\'\u0074\x6d\x72\']=this[\'\u0077\u0069\u006e\'][\'\x73\x65\x74\x54\u0069\x6d\u0065\x6f\x75\x74\'](function(){return !P2[\'\u0077\x69\u006e\'][k[P2[\'\u0074\x79\x70\u0065\']]] && P2[\'\u0061\x73\u0074\']();},5000);};V1[\'\x70\u0072\x6f\x74\x6f\u0074\x79\x70\u0065\'][\'\u0067\x64\']=function(X2){var X_=this;return this[\'\x77\x75\'][\'\u0074\x68\x65\u006e\'](function(V9){return V9 === null || V9 === void 0?void 0:V9[\'\x75\x72\x6c\'](X_[\'\x67\x66\u0063\x6f\'](X2));});};V1[\'\x70\x72\u006f\u0074\u006f\x74\u0079\u0070\x65\'][\'\u0062\x36\u0061\u0062\']=function(K7){return this[\'\u0077\u0069\x6e\'][\'\u0055\x69\x6e\u0074\u0038\x41\x72\u0072\x61\x79\'][\'\x66\x72\x6f\x6d\'](this[\'\x77\u0069\u006e\'][\'\u0061\x74\u006f\x62\'](K7),function(a$){return a$[\'\x63\u0068\u0061\u0072\u0043\x6f\x64\x65\u0041\x74\'](0);});};V1[\'\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065\'][\'\u0067\u0066\x63\x6f\']=function(w1){var E_;var r$=((E_=this[\'\u0077\x69\x6e\'][\'\u006e\u0061\u0076\u0069\u0067\u0061\u0074\u006f\u0072\']) === null || E_ === void 0?void 0:E_[\'\x75\u0073\u0065\u0072\x41\x67\x65\u006e\x74\']) || \'\';var o0=this[\'\x77\u0069\u006e\'][\'\u006c\u006f\u0063\x61\x74\u0069\x6f\u006e\'][\'\x68\u006f\x73\u0074\x6e\u0061\x6d\x65\'] || \'\';var J8=this[\'\u0077\x69\x6e\'][\'\u0069\u006e\x6e\x65\u0072\x48\x65\u0069\u0067\u0068\x74\'];var u1=this[\'\u0077\x69\u006e\'][\'\u0069\u006e\u006e\x65\u0072\x57\u0069\u0064\x74\u0068\'];var s7=this[\'\u0077\u0069\u006e\'][\'\u0073\u0065\u0073\x73\x69\u006f\x6e\x53\u0074\u006f\u0072\x61\u0067\u0065\']?1:0;return [J8,u1,s7,X5(this[\'\u0077\x69\x6e\']),0,w1,o0[\'\x73\x6c\x69\u0063\x65\'](0,100),r$[\'\x73\u006c\u0069\x63\x65\'](0,15)][\'\x6a\x6f\u0069\x6e\'](\'\u002c\');};V1[\'\u0070\x72\x6f\u0074\u006f\x74\u0079\x70\x65\'][\'\x61\u0073\x74\']=function(){var q2=this;this[\'\x67\x64\'](this[\'\u0074\u0079\x70\x65\'])[\'\u0074\x68\x65\x6e\'](function(a9){q2[\'\x77\u0069\u006e\'][q2[\'\x69\u0064\'] + G]=q2[\'\x76\x65\x72\'];var x8=q2[\'\x77\x69\x6e\'][\'\u0064\x6f\x63\x75\u006d\u0065\u006e\u0074\'][\'\x63\u0072\u0065\u0061\u0074\x65\x45\x6c\u0065\x6d\u0065\x6e\u0074\'](\'\u0073\u0063\u0072\u0069\x70\x74\');x8[\'\u0073\x72\x63\']=Z(q2[\'\x67\x66\x75\'](a9),q2[\'\u0069\u0064\'][\'\x74\u006f\x53\u0074\u0072\x69\u006e\u0067\']());q2[\'\x77\u0069\u006e\'][\'\u0064\x6f\x63\x75\x6d\x65\x6e\u0074\'][\'\u0068\x65\u0061\u0064\'][\'\x61\x70\u0070\u0065\x6e\u0064\u0043\x68\u0069\x6c\x64\'](x8);});};V1[\'\x70\u0072\u006f\u0074\x6f\x74\x79\x70\u0065\'][\'\x69\u0077\x61\']=function(){var P7=this;if(!(WebAssembly === null || WebAssembly === void 0?void 0:WebAssembly[\'\u0069\u006e\x73\u0074\x61\x6e\x74\u0069\u0061\u0074\x65\'])){return Promise[\'\x72\u0065\x73\u006f\u006c\u0076\x65\'](undefined);}return this[\'\u0077\u0069\u006e\'][\'\x57\x65\u0062\u0041\x73\x73\u0065\x6d\x62\x6c\u0079\'][\'\x69\x6e\u0073\u0074\x61\x6e\u0074\x69\u0061\x74\u0065\'](this[\'\x62\u0036\x61\x62\'](this[\'\x62\x36\u0034\x64\']),{})[\'\u0074\u0068\x65\u006e\'](function(d_){var Z0=d_[\'\u0069\x6e\u0073\x74\x61\u006e\x63\u0065\'][\'\u0065\u0078\u0070\u006f\u0072\u0074\u0073\'];var i$=Z0[\'\u006d\u0065\x6d\u006f\x72\x79\'];var W0=Z0[\'\u0075\x72\x6c\'];var E7=new P7[\'\u0077\x69\x6e\'][\'\u0054\x65\x78\u0074\u0045\x6e\x63\x6f\u0064\u0065\u0072\']();var I7=new P7[\'\u0077\u0069\x6e\'][\'\x54\u0065\x78\u0074\x44\x65\u0063\x6f\x64\x65\x72\'](\'\u0075\x74\x66\x2d\x38\');return {url:function(Q9){var a3=E7[\'\x65\x6e\x63\u006f\x64\u0065\'](Q9);var c0=new P7[\'\u0077\x69\u006e\'][\'\u0055\u0069\x6e\u0074\x38\u0041\x72\u0072\u0061\u0079\'](i$[\'\x62\u0075\x66\u0066\x65\u0072\'],0,a3[\'\u006c\x65\u006e\u0067\x74\u0068\']);c0[\'\u0073\x65\x74\'](a3);var j5=c0[\'\u0062\u0079\x74\x65\x4f\x66\x66\u0073\x65\x74\'] + a3[\'\x6c\u0065\x6e\x67\x74\u0068\'];var s1=W0(c0,a3[\'\u006c\x65\x6e\x67\x74\x68\'],j5);var i5=new P7[\'\u0077\u0069\u006e\'][\'\u0055\x69\x6e\x74\x38\u0041\x72\u0072\u0061\u0079\'](i$[\'\x62\x75\x66\x66\u0065\u0072\'],j5,s1);return I7[\'\x64\u0065\u0063\x6f\x64\u0065\'](i5);}};});};V1[\'\u0070\u0072\u006f\x74\u006f\u0074\u0079\u0070\x65\'][\'\x67\u0063\x75\u006b\']=function(){return ("")[\'\u0063\u006f\x6e\x63\u0061\x74\'](this[\'\x69\x64\'])[\'\x63\x6f\x6e\u0063\u0061\x74\'](z);};V1[\'\u0070\u0072\x6f\u0074\x6f\u0074\u0079\x70\u0065\'][\'\u0067\x66\u0075\']=function(d8){return ("")[\'\u0063\x6f\x6e\u0063\u0061\u0074\'](X(this[\'\u0077\x69\u006e\'],d8),\'\u003f\u0069\u0064\u003d\')[\'\u0063\x6f\x6e\x63\u0061\x74\'](this[\'\u0069\u0064\']);};return V1;})();(function(e9,B9,R1,B5,y$,R$){var Y9=new L(window,e9,R1,B5,y$,R$);window[B9]=function(){Y9[\'\x69\u006e\']();};})(\'2030611\',\'nfxze\',\'2\',\'AGFzbQEAAAABHAVgAAF/YAN/f38Bf2ADf39/AX5gAX8AYAF/AX8DCQgAAQIBAAMEAAQFAXABAQEFBgEBgAKAAgYJAX8BQcCIwAILB2cHBm1lbW9yeQIAA3VybAADGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBABBfX2Vycm5vX2xvY2F0aW9uAAcJc3RhY2tTYXZlAAQMc3RhY2tSZXN0b3JlAAUKc3RhY2tBbGxvYwAGCtsFCCEBAX9BuAhBuAgoAgBBE2xBoRxqQYfC1y9wIgA2AgAgAAuTAQEFfxAAIAEgAGtBAWpwIABqIgQEQEEAIQBBAyEBA0AgAUEDIABBA3AiBxshARAAIgZBFHBBkAhqLQAAIQMCfyAFQQAgBxtFBEBBACAGIAFwDQEaIAZBBnBBgAhqLQAAIQMLQQELIQUgACACaiADQawILQAAazoAACABQQFrIQEgAEEBaiIAIARJDQALCyACIARqC3ECA38CfgJAIAFBAEwNAANAIARBAWohAyACIAUgACAEai0AAEEsRmoiBUYEQCABIANMDQIDQCAAIANqMAAAIgdCLFENAyAGQgp+IAd8QjB9IQYgA0EBaiIDIAFHDQALDAILIAMhBCABIANKDQALCyAGC4wDAgN+B38gACABQQMQAiEDIAAgAUEFEAIhBUG4CCADQbAIKQMAIgQgAyAEVBtBqAgoAgAiAEEyaiIBIAFsQegHbK2AIgQgAEEOaiIKIABBBGsgA0KAgPHtxzBUIgsbrYA+AgAQABoQABogAkLo6NGDt87Oly83AABBB0EKIANCgJaineUwVCIGG0ELQQwgBhsgAkEIahABIQAQABojAEEQayIBJAAgAEEuOgAAIAFB4961AzYCDCAAQQFqIQdBACEAIAFBDGoiDC0AACIIBEADQCAAIAdqIAg6AAAgDCAAQQFqIgBqLQAAIggNAAsLIAFBEGokACAAIAdqIQFBuAggBCAKrYAgBUIbhkIAQoCAgCBCgICAMEKAgIAIQoCAgBggBUIIURtCgICACCADQoCQzKf2MVQbIANCgJjGrs8xVBsgBhsgCxuEhD4CABAAGkECQQQQAEEDcCIAGyEGA0AgAUEvOgAAIAAgCUYhByAGQQUgAUEBahABIQEgCUEBaiEJIAdFDQALIAEgAmsLBAAjAAsGACAAJAALEAAjACAAa0FwcSIAJAAgAAsFAEG8CAsLOwMAQYAICwaeoqassrYAQZAICxSfoKGjpKWnqKmqq62ur7Cxs7S1twBBqAgLDgoAAAA9AAAAAMzHyZEB\',\'6\',\'1.0.282\');})();})();'
        script1.id = 'antiadblock-popup'
        script2.type = 'text/javascript'
        script2.async = true
        script2.src = process.env.NEXT_PUBLIC_VIDEO_PLAYER_POPUNDER_URL

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        script2['data-cfasync'] = 'false'

        document.body.appendChild(script1)
        document.body.appendChild(script2)
      }
    }

    document.addEventListener('click', clickHandler)

    return () => document.addEventListener('click', clickHandler)
  }, [firstClickRef])

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description,
    thumbnailUrl: [post.thumb],
    uploadDate: post.publishedAt,
    duration: parsedDuration,
    embedUrl: postEmbedUrl,
    interactionStatistics: [
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: postViewsNumber,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'LikeAction' },
        userInteractionCount: postLikes,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'DislikeAction' },
        userInteractionCount: postDislikes,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'CommentAction' },
        userInteractionCount: postCommentsNumber,
      },
    ],
  }

  let canonicalUrl = `${baseUrl}/posts/videos/${post.slug}`

  if (locale !== 'en') {
    canonicalUrl = `${baseUrl}/${locale}/posts/videos/${post.slug}`
  }

  const htmlPageMetaUrlProps = (
    new HtmlPageMetaVideoService(
      post.title,
      description,
      post.thumb,
      canonicalUrl,
      postEmbedUrl,
      post.duration
    )
  ).getProperties()
  const htmlPageMetaProps = {
    ...htmlPageMetaContextProps,
    resourceProps: htmlPageMetaUrlProps,
    structuredData: JSON.stringify(structuredData),
  }

  let relatedPostsSection: ReactElement | null = null

  if (relatedPosts.length > 0) {
    relatedPostsSection = (
      <div className={ styles.postPage__relatedVideos }>
        <span className={ styles.postPage__relatedVideosTitle }>
          { t('video_related_videos_title') }
        </span>
        <PostCardGallery
          posts={ relatedPosts }
          postCardOptions={ [{ type: 'savePost' }, { type: 'react' }] }
        />
      </div>
    )
  }

  return (
    <>
      { popUnder }

      <HtmlPageMeta { ...htmlPageMetaProps } />

      <MobileBanner />

      <Post
        post={ post }
        key={ post.id }
        postCommentsNumber={ postCommentsNumber }
        postLikes={ postLikes }
        postDislikes={ postDislikes }
        postViewsNumber={ postViewsNumber }
      />

      { relatedPostsSection }
    </>
  )
}
