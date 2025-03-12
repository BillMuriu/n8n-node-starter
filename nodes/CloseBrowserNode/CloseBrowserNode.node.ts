import * as puppeteer from 'puppeteer';
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class CloseBrowserNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Close Browser Node',
		name: 'closeBrowserNode',
		group: ['transform'],
		version: 1,
		description: 'Close Puppeteer Browser Instance',
		defaults: {
			name: 'Close Browser Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		try {
			for (const item of items) {
				const browserWSEndpoint = item.json.browserWSEndpoint as string;

				if (!browserWSEndpoint) {
					throw new NodeOperationError(this.getNode(), 'Browser session ID not found.');
				}

				// Reconnect to the existing browser instance and close it
				const browser = await puppeteer.connect({ browserWSEndpoint });
				await browser.close();
				console.log(`Browser session closed.`);
			}

			return [items];
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
}
