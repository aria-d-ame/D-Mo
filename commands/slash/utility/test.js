const { Command, CommandType } = require('gcommands');

new Command({
    name: 'test',
    description: 'Tes tcommand',
    type: [CommandType.SLASH, CommandType.MESSAGE],
    run: async (ctx) => {
        ctx.reply('TEST!')
    }
})