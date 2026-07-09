import React from "react";
import TextType from "./TextType";

function AboutUs() {
    const lyrics = {
        debut: {
            song: "Our Song",
            quote: '"Our song is the slamming screen door"',
        },
        fearless: {
            song: "Love Story",
            quote: '"It\'s a love story, baby, just say yes"',
        },
        speakNow: {
            song: "Enchanted",
            quote: '"Please don\'t be in love with someone else"',
        },
        red: {
            song: "All Too Well",
            quote: '"You call me up again just to break me like a promise"',
        },
        album1989: {
            song: "Is It Over Now",
            quote: '"Let\'s Fast Forward to 300 takeout coffees later"',
        },
        reputation: {
            song: "Delicate",
            quote: '"Is it cool that I said all that?"',
        },
        lover: {
            song: "Lover",
            quote: '"Can I go where you go?"',
        },
        folklore: {
            song: "cardigan",
            quote: '"You drew stars around my scars"',
        },
        evermore: {
            song: "champagne problems",
            quote: '"Your Midas touch on the Chevy door"',
        },
        midnights: {
            song: "Anti-Hero",
            quote: '"It\'s me, hi, I\'m the problem, it\'s me"',
        },
        ttpd: {
            song: "Fortnight",
            quote: '"I love you, it\'s ruining my life"',
        },
        tloas: {
            song: "The Fate Of Ophelia",
            quote: '"Keep it 100 on the land, the sea, the sky"'
        }
    };
    const lyricQuotesArray = Object.values(lyrics).map(
        (item) => `${item.quote} — ${item.song}`);

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-folklore">
                    About The Eras Store
                </h2>

                <div className="w-16 h-0.5 bg-slate-800 mx-auto"></div>

                <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed font-folklore max-w-2xl mx-auto">
                    <p>
                        Welcome to a space where music meets memory. {" "}
                        <strong className="text-slate-900">The Eras Store</strong> is curated for
                        those who find pieces of themselves in every chapter, lyric, and melody.
                    </p>
                    <p>
                        From the poetic woods of <span className="italic">folklore</span> to the neon
                        synth of <span className="italic">The Life of a Showgirl</span>, we provide high-quality vinyls (fanmade),
                        CDs, and exclisove merchandise to help you celebrate your favorite musical eras.
                    </p>
                </div>
                <div className="pt-4 min-h-[40px]">
                    <p className="text-sm md:text-base text-slate-400 font-folklore italic tracking-wide">
                        <TextType
                            strings={lyricQuotesArray}
                            typeSpeed={60}
                            backSpeed={30}
                            backDelay={2500} 
                        />
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;