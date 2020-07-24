import http from "http";
import querystring from "querystring";
import { EventEmitter } from "events";
import { promises as fs } from "fs";
import path from "path";

interface Options{
	port: number;
}

export default class HttpServer extends EventEmitter{
	port: number;
	server?: http.Server;

	constructor(options: Options){
		super();
		this.port = options.port;
		this.server = undefined;
	}

	async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>{
		res.writeHead(200, { "Content-Type": "text/html" });

		if(req.url){
			const query = querystring.parse(req.url.split("?")[1]);
			const code = query.code;

			this.emit("code", code);
			const html = await fs.readFile(path.join(__dirname, "index.html"), { encoding: "utf-8" });
			res.end(html);
			return;
		}

		res.end("Failed to read code!");
	}

	start(): void{
		this.server = http.createServer(this.handleRequest.bind(this)).listen(this.port);
	}

	stop(): void{
		if(this.server instanceof http.Server)
			this.server.close();
	}
}
