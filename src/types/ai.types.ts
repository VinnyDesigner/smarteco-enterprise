export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  chartData?: {
    title: string;
    type: 'line' | 'bar';
    dataKeys: string[];
    data: Array<Record<string, any>>;
  };
  tableData?: {
    headers: string[];
    rows: Array<Array<string | number>>;
  };
}
