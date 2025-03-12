import * as puppeteer from 'puppeteer';
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class LaunchBrowserNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Launch Browser Node',
		name: 'launchBrowserNode',
		group: ['transform'],
		version: 1,
		description: 'Launch Puppeteer Browser Instance',
		defaults: {
			name: 'Launch Browser Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let browser;
		try {
			browser = await puppeteer.launch({ headless: false });
			const page = await browser.newPage();
			await page.goto('https://example.com');

			const browserWSEndpoint = browser.wsEndpoint(); // Get WebSocket endpoint

			// Store WebSocket endpoint in workflow static data
			const staticData = this.getWorkflowStaticData('global');
			staticData.browserWSEndpoint = browserWSEndpoint;

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				let item = items[itemIndex];
				item.json.browserWSEndpoint = browserWSEndpoint;
			}

			return [items];
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
}
