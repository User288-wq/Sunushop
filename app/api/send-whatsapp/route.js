import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { number, text } = await req.json();
        
        if (!number || !text) {
            return NextResponse.json({ 
                error: 'Numero et texte requis' 
            }, { status: 400 });
        }

        console.log('[Envoi] Message a ' + number + ': ' + text);
        
        const response = await fetch('http://localhost:8080/message/sendText/sunushop', {
            method: 'POST',
            headers: {
                'apikey': '429683C4C977415CAAFCCE10F7D57E11',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number, text })
        });
        
        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('[Erreur] Envoi:', error);
        return NextResponse.json({ 
            error: 'Erreur interne du serveur' 
        }, { status: 500 });
    }
}
