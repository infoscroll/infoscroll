exports.handler = async function () {
  try {
    const params = new URLSearchParams({
      source: "publisher",
      placementId: "a4de8a64-bb13-48b4-b5d9-fa2dad0475e3"
    });

    const response = await fetch(
      `https://api.adscod.com/api/v1/serve?${params}`,
      {
        headers: {
          "X-Adscod-Key": process.env.ADSCOD_API_KEY
        }
      }
    );

    if (!response.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Ad provider unavailable" })
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
        ads: Array.isArray(data.ads) ? data.ads : []
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to load ads" })
    };
  }
};
