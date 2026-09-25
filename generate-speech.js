module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const selectedVoice =
      voiceId || "21m00Tcm4TlvDq8ikWAM";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",

        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },

        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    if (!response.ok) {

      const error = await response.text();

      return res.status(response.status).json({
        error: error
      });
    }

    const audioBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader(
      "Content-Type",
      "audio/mpeg"
    );

    return res.status(200).send(audioBuffer);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

};