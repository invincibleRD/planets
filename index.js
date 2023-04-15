const { log } = require("console");
const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

function habitable(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (chunks) => {
    if (habitable(chunks)) {
      habitablePlanets.push(chunks);
    }
  })
  .on("end", () => {
    log(habitablePlanets.map(planet=>{
       return planet["kepler_name"]
    }));
    log(`Done 🔥 Total habitable planets: ${habitablePlanets.length}`);
  })
  .on("error", (error) => {
    log("Error", error);
  });
