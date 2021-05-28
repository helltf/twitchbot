module.exports = {
    description:"Evaluates the given code",
    required_parameters:"code",
    name: "eval",
    required_permissions: 4,
    optional_parameters:"none",
	invocation: async (channel,user,[...code]) => {
        try {
            const ev = await eval('(async () => {' + code.join(' ') + '})()');
            if(ev === undefined || ev === null) return undefined;
            return `${String(ev)}`;
        } catch (e) {
            console.log(e)
            return `FeelsDankMan error: ${e}`;
        }      
    }
}