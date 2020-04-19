interface HeaderRows {
    headers: string[];
    rows: {}[]
}

export function parseCsvToRowsAndColumn(csvText: string, csvColumnDelimiter = '\t'): HeaderRows {
    const rows = csvText.split('\n');
    if (!rows || rows.length === 0) {
        return {
            headers: [],
            rows: []
        };
    }

    const [header, ...content] = rows;
    const headerRows = header.split(csvColumnDelimiter);

    return {
        headers: headerRows,
        rows: content.map(row => {
            let item = {};
            const values = row.split(csvColumnDelimiter);
            for (let index in headerRows) {
                item = { ...item, [headerRows[index]]: values[index] }
            }
            return item;
        })
    }
}