export const NOTION_CONFIG = {
    apiKey: (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim(),
    crmDbId: (process.env.NOTION_CRM_DB_ID || "2e90d6014acc80c0b603ffa9e74f7f7d").trim(),
    toolsDbId: (process.env.NOTION_TOOLS_DB_ID || "08ac767d313845ca91886ce45c379b99").trim(),
    blogDbId: (process.env.NOTION_BLOG_DB_ID || "db668e4687ed455498357b8d11d2c714").trim(),
    musicDbId: (process.env.NOTION_MUSIC_DB_ID || "2780d6014acc8064a87eedc5e96fe22e").trim(),
}

export const TWILIO_CONFIG = {
    accountSid: (process.env.TWILIO_ACCOUNT_SID || "ACd0b71f7f267952855cb3ce0fb950505680ca7ff6e58205").trim(),
    authToken: (process.env.TWILIO_AUTH_TOKEN || "fb562143e370be7264").trim(),
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '+447360277713',
}
