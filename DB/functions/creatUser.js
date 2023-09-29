exports = function({ query, headers, body }, response) {
    // Data can be extracted from the request as follows:
    const { arg1, arg2 } = query || {};
    const contentTypes = headers ? headers["Content-Type"] : undefined;
    const reqBody = body;

    console.log("arg1, arg2: ", arg1, arg2);
    console.log("Content-Type:", contentTypes);
    console.log("Request body:", reqBody);

    // Reste du code...

    return "Hello World!";
};