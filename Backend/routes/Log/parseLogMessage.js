function parseLogMessage(log) {
    const parts = log.split(", ");

    const query = parts[0].replace("Query: ", "").trim();
    const Data = parts[1].replace("Data: ", "") .trim();
    let error = null;

    if (parts.length > 2) {
        error = parts[2].replace("Error: ", "").trim();
    }

    return { query, Data, error };
}


module.exports = { parseLogMessage };
