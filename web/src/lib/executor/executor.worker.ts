/// <reference lib="webworker" />
import { handleWorkerRequest } from "./worker-handler";
import type { WorkerRequest, WorkerResponse } from "./protocol";

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
	void respond(event.data);
};

async function respond(request: WorkerRequest): Promise<void> {
	const result = await handleWorkerRequest(request);
	(self as unknown as Worker).postMessage(result.response, result.transfer);
}

export type { WorkerRequest, WorkerResponse };
