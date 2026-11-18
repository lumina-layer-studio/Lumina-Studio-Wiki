import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {isPolymakerLogoAuthorized} from './authorization';

export default function PolymakerLogo(): React.JSX.Element {
  return (
    <span style={{display: 'inline-block', width: 120, minWidth: 120}}>
      <BrowserOnly fallback={<span>Polymaker</span>}>
      {() => isPolymakerLogoAuthorized() ? (
        <img
          src="https://luminastudio.com.cn/logos/polymaker-teal.svg"
          width="120"
          height="25"
          alt="Polymaker"
          loading="lazy"
        />
      ) : <span>Polymaker</span>}
      </BrowserOnly>
    </span>
  );
}
