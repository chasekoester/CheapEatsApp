/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    OPENAI_API_KEY?: string;
    GOOGLE_SHEETS_ID?: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
    GOOGLE_PRIVATE_KEY?: string;
    GOOGLE_PLACES_API_KEY?: string;
    DAILY_GENERATION_KEY?: string;
    NETLIFY_DATABASE_URL?: string;
    NETLIFY_DATABASE_URL_UNPOOLED?: string;
  }
}
