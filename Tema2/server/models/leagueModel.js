function extractLastThreeWinners(response) {
    const validWinners = response.seasons
        .filter(season => season.winner !== null)
        .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
        .map(season => {
            const startYear = new Date(season.startDate).getFullYear();
            const endYear = new Date(season.endDate).getFullYear();
            const seasonYear = startYear === endYear 
                ? `${startYear}` 
                : `${startYear}/${endYear.toString().slice(-2)}`;

            return {
                season: seasonYear,
                winner: season.winner.name
            };
        });

    return validWinners;
}

module.exports = {
    extractLastThreeWinners
};