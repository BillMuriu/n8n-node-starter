import puppeteer from 'puppeteer';  // Import Puppeteer
import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class ExampleNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Example Node',
        name: 'exampleNode',
        group: ['transform'],
        version: 1,
        description: 'Basic Example Node with Puppeteer Web Crawling',
        defaults: {
            name: 'Example Node',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        properties: [
            {
                displayName: 'My String',
                name: 'myString',
                type: 'string',
                default: '',
                placeholder: 'Placeholder value',
                description: 'The description text',
            },
        ],
    };

    // This is where the Puppeteer functionality will be implemented
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const items = this.getInputData();
        let item: INodeExecutionData;
        let myString: string;

        // Puppeteer functionality to open browser for 6 seconds
        try {
			// Launch the browser with headless: false to see the browser window
			const browser = await puppeteer.launch({ headless: false });
			const page = await browser.newPage(); // Open a new page
			await page.goto('https://example.com'); // Navigate to the website
			
			// Wait for 6 seconds using the custom delay function
			await delay(6000); // Wait for 6 seconds (6000ms)
			
			await browser.close(); // Close the browser
	
			console.log('Browser opened for 6 seconds and then closed.');
	
			// Add your custom logic here (e.g., adding data to the node)
		} catch (error) {
		   
        }

        // Process node properties
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                myString = this.getNodeParameter('myString', itemIndex, '') as string;
                item = items[itemIndex];
                item.json.myString = myString;
            } catch (error) {
                if (this.continueOnFail()) {
                    items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
                } else {
                    if (error.context) {
                        error.context.itemIndex = itemIndex;
                        throw error;
                    }
                    throw new NodeOperationError(this.getNode(), error, { itemIndex });
                }
            }
        }

        return [items];
    }
}
