import fetch from "node-fetch"

describe('Tests for the get-records endpoint', () => {

    test('Records match query', async () => {
        const req = {
            startDate: "2016-01-26",
            endDate: "2018-02-02",
            minCount: 2700,
            maxCount: 3000
        };

        const response = await fetch('http://localhost:3000/get-records',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            }
        );

        const { code, msg, records } = await response.json();
        expect(code).toBe(0);
        expect(records.length).toBeGreaterThan(0);

        const someRecords = records.slice(0,5);
        
        for(const record of records){
            expect(Date.parse(record.createdAt)).toBeGreaterThan(Date.parse(req.startDate));
            expect(Date.parse(record.createdAt)).toBeLessThan(Date.parse(req.endDate));
            expect(record.totalCount).toBeGreaterThan(req.minCount);
            expect(record.totalCount).toBeLessThan(req.maxCount);
        }
        

    }, 30000);

})