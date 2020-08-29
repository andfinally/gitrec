#!/usr/bin/env node

const { Select } = require("enquirer");
const { exec } = require("child_process");
const { stderr, stdout } = require("process");

// Get list of recent branches
exec(
	"git for-each-ref --sort=-committerdate --count=10 --format='%(refname:short)' refs/heads/",
	(error, stdout, stderr) => {
		if (error) {
			console.log(`Recent branches error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`Recent branches stderr: ${stderr}`);
			return;
		}

		outputList(stdout);
	}
);

// Output select
function outputList(stdout) {
	let branches = stdout.split("\n");
	branches = branches.filter(branch => {
		return branch.trim();
	});

	const prompt = new Select({
		name: "branch",
		message: "Check out a branch",
		choices: branches
	});

	prompt
		.run()
		.then(checkOutBranch)
		.catch(console.error);
}

// Check out selected branch
function checkOutBranch(answer) {
	exec("git checkout " + answer),
	(error, stdout, stderr) => {
		if (error) {
			console.log(`Checkout error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`Checkout stderr: ${stderr}`);
			return;
		}
	}
	process.stdout.write('\x1Bc');
}
