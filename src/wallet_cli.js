// command
import { program } from "commander";
import { erc20ReadCommand} from "./command/erc20read.js";
import {erc20WriteCommand} from "./command/erc20write.js";
import {
	importMnemonicCommand,
	genAccountCommand,
	genMnemonicCommand
} from "./command/mnemonic.js";

program.version("v0.0.1").description("Terry wallet CLI");

[
	genMnemonicCommand,
	importMnemonicCommand,
	genAccountCommand,
	erc20ReadCommand,
	erc20WriteCommand,
].forEach((cmd) => {
	const command = program.command(cmd.name).description(cmd.description);
	// 如果命令定义了 setup 方法，调用它来添加选项
	if (cmd.setup) cmd.setup(command);
	command.action(cmd.action);

})

program.parse(process.argv);
