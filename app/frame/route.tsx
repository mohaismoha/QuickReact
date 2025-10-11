import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const baseUrl = "https://quickreact.app"

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/preview.png" />
        <meta property="fc:frame:button:1" content="Play QuickReact" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/game" />
        <meta property="fc:frame:button:2" content="Leaderboard" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="${baseUrl}/leaderboard" />
        <meta property="og:title" content="QuickReact - Reaction Time Game" />
        <meta property="og:description" content="Test your reaction time and earn QRP tokens" />
        <meta property="og:image" content="${baseUrl}/preview.png" />
      </head>
      <body>
        <h1>QuickReact Frame</h1>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
