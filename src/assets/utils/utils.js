const jsonCopy = (src) => {
    return !src ? src : JSON.parse(JSON.stringify(src));
};

const redactedResponse = (body) => {
    const logOutput = jsonCopy(body);

    if (logOutput) {
        if (logOutput.categoryChecks) {
            for (const individual of logOutput.categoryChecks) {
                delete individual.individuals
            }
            delete logOutput.individuals;
        }
    }
    return JSON.stringify(logOutput);
};

module.exports = redactedResponse;