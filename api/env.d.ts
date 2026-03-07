declare namespace NodeJS {
    interface ProcessEnv {
        NOTION_API_KEY: string;
        NOTION_CRM_DB_ID: string;
        NOTION_TOOLS_DB_ID: string;
        NOTION_BLOG_DB_ID: string;
        NOTION_MUSIC_DB_ID: string;
        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
        TWILIO_WHATSAPP_NUMBER: string;
        [key: string]: string | undefined;
    }
}

declare var process: NodeJS.Process;
declare var Buffer: {
    from(str: string, encoding?: string): { toString(encoding?: string): string };
};

declare namespace NodeJS {
    interface Process {
        env: ProcessEnv;
    }
}

declare module '@vercel/node' {
    import { IncomingMessage, ServerResponse } from 'http';
    export interface VercelRequest extends IncomingMessage {
        query: { [key: string]: string | string[] };
        cookies: { [key: string]: string };
        body: any;
        method: string;
    }
    export interface VercelResponse extends ServerResponse {
        send: (body: any) => VercelResponse;
        json: (jsonBody: any) => VercelResponse;
        status: (statusCode: number) => VercelResponse;
        redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
        setHeader: (name: string, value: string | number | readonly string[]) => VercelResponse;
    }
}
