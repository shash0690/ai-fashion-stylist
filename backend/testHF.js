import fetch from "node-fetch";

const HF_API_KEY = process.env.HF_API_KEY || "तुम्हारी_API_KEY";

async function testHF() {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/nateraw/vision-transformer",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: "test image"
            })
        }
    );

    const data = await response.json();
    console.log(data);
}

testHF();
