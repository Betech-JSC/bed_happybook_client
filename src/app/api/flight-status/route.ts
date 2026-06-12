import { NextResponse } from "next/server";

// Cache in RAM for 15 minutes to stay within the 200 req/month free tier
const cacheStore = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get("flightNumber")?.toUpperCase().replace(/\s/g, "");
  const date = searchParams.get("date"); // Format: yyyy-mm-dd

  if (!flightNumber || !date) {
    return NextResponse.json({ error: "Missing flightNumber or date parameters" }, { status: 400 });
  }

  const cacheKey = `${flightNumber}_${date}`;
  const cached = cacheStore.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.RAPID_API_KEY || "270b69387amsha43b11b1b0a8eedp1b6036jsn48a375d93ad2";
  const apiHost = process.env.RAPID_API_HOST || "aerodatabox.p.rapidapi.com";

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(flightNumber + " flight status " + date)}`;
  const oagUrl = `https://www.oag.com/flight-status/${encodeURIComponent(flightNumber)}`;

  try {
    const flightUrl = `https://${apiHost}/flights/number/${flightNumber}/${date}?withCodeshared=true`;
    const res = await fetch(flightUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    });

    if (res.status === 204) {
      const fallbackPayload = {
        isFallback: true,
        flightNumber,
        date,
        googleUrl,
        oagUrl,
        message: "Flight details not found in GDS. Please use fallback quick links below.",
      };
      cacheStore.set(cacheKey, { data: fallbackPayload, expiresAt: Date.now() + CACHE_TTL_MS });
      return NextResponse.json(fallbackPayload);
    }

    if (!res.ok) {
      throw new Error(`AeroDataBox API status error: ${res.status}`);
    }

    const rawData = await res.json();

    // If AeroDataBox returns no data, provide the fallback links
    if (!rawData || rawData.length === 0) {
      const fallbackPayload = {
        isFallback: true,
        flightNumber,
        date,
        googleUrl,
        oagUrl,
        message: "Flight details not found in GDS. Please use fallback quick links below.",
      };
      cacheStore.set(cacheKey, { data: fallbackPayload, expiresAt: Date.now() + CACHE_TTL_MS });
      return NextResponse.json(fallbackPayload);
    }

    const flight = rawData[0];
    const arrivalAirportIata = flight.arrival?.airport?.iata;
    let weather = null;

    // Fetch METAR weather for arrival airport if available
    if (arrivalAirportIata) {
      const weatherUrl = `https://${apiHost}/airports/iata/${arrivalAirportIata}/weather/current`;
      try {
        const weatherRes = await fetch(weatherUrl, {
          method: "GET",
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": apiHost,
          },
        });
        if (weatherRes.ok) {
          weather = await weatherRes.json();
        }
      } catch (weatherErr) {
        console.error("Failed to fetch METAR weather:", weatherErr);
      }
    }

    const responseData = {
      isFallback: false,
      flightNumber,
      date,
      airline: flight.airline?.name || "Vietnam Local Airline",
      status: flight.status || "Scheduled",
      departure: {
        airport: flight.departure?.airport?.name || flight.departure?.airport?.iata,
        iata: flight.departure?.airport?.iata,
        terminal: flight.departure?.terminal || "--",
        gate: flight.departure?.gate || "--",
        scheduledTime: flight.departure?.scheduledTime?.local || flight.departure?.scheduledTimeLocal,
      },
      arrival: {
        airport: flight.arrival?.airport?.name || flight.arrival?.airport?.iata,
        iata: flight.arrival?.airport?.iata,
        terminal: flight.arrival?.terminal || "--",
        gate: flight.arrival?.gate || "--",
        baggageClaim: flight.arrival?.baggageClaim || "--",
        scheduledTime: flight.arrival?.scheduledTime?.local || flight.arrival?.scheduledTimeLocal,
      },
      aircraft: flight.aircraft?.model || "Unknown",
      weather: weather ? {
        tempC: weather.tempC,
        windKts: weather.wind?.speedKts || 0,
        condition: weather.skyCondition || "Clear"
      } : null,
    };

    cacheStore.set(cacheKey, { data: responseData, expiresAt: Date.now() + CACHE_TTL_MS });
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Flight Status Proxy Error:", error);
    // Fallback on request exceptions to maintain user experience
    return NextResponse.json({
      isFallback: true,
      flightNumber,
      date,
      googleUrl,
      oagUrl,
      message: "Flight Radar service is temporarily limited. Please use quick links below.",
    });
  }
}
