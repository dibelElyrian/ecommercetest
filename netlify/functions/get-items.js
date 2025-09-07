const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Default: do NOT show 0-stock items
    let showAll = false;

    // Support both GET (query param) and POST (body) for flexibility
    if (event.httpMethod === 'GET') {
        const url = new URL(event.headers.referer || `http://localhost${event.path}${event.rawUrl || ''}`);
        showAll = url.searchParams.get('showAll') === '1' || url.searchParams.get('showAll') === 'true';
    } else if (event.httpMethod === 'POST' && event.body) {
        try {
            const body = JSON.parse(event.body);
            showAll = !!body.showAll;
        } catch { }
    }

    try {
        let query = supabase
            .from('items')
            .select('*')
            .eq('active', true)
            .order('id', { ascending: true });

        if (!showAll) {
            query = query.gt('stock', 0);
        }

        const { data, error } = await query;

        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: error.message })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, items: data })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: err.message })
        };
    }
};