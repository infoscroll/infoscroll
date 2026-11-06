exports.handler = async function () {
  try {
    const apiKey = process.env.ADSCOD_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "ADSCOD_API_KEY is missing" })
      };
    }

    const params = new URLSearchParams({
      source: "publisher",
      placementId: "a4de8a64-bb13-48b4-b5d9-fa2dad0475e3"
    });

    const response = await fetch(
      `https://api.adscod.com/api/v1/serve?${params}`,
      {
        headers: { "X-Adscod-Key": apiKey }
      }
    );

    if (!response.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Adscod request failed",
          upstreamStatus: response.status
        })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify({
        success: true,
        ads: Array.isArray(data.ads) ? data.ads : []
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function failed",
        details: error.message
      })
    };
  }
};
