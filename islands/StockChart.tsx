import { useEffect, useState } from "preact/hooks";
import Chart from "@/islands/Chart.tsx";

interface StockChartProps {
    endpoint: string;
}

export default function StockChart({ endpoint }: StockChartProps) {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mediumTermGrowth, setMediumTermGrowth] = useState<number | null>(
        null,
    );
    const [longTermGrowth, setLongTermGrowth] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStockData() {
            try {
                const response = await fetch(endpoint);
                const assets = await response.json();
                const stockAssets = assets.filter((asset: any) =>
                    asset.type === "stock"
                );

                if (stockAssets.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const tickers = stockAssets.map((asset: any) => asset.ticker);
                const chartResponse = await fetch(
                    `/api/yf/chart?tickers=${tickers.join(",")}`,
                );
                const data = await chartResponse.json();
                const formattedData = formatChartData(data, stockAssets);
                setChartData(formattedData);
                calculateGrowths(data, stockAssets);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStockData();
    }, [endpoint]);

    function formatChartData(data, stockAssets) {
        const labels = data[0].data.quotes.map((quote) =>
            new Date(quote.date).toLocaleDateString()
        );

        const datasets = data.map((stock) => {
            const asset = stockAssets.find((asset: any) =>
                asset.ticker === stock.ticker
            );
            const amount = asset ? asset.amount : 1;
            return {
                label: stock.ticker,
                data: stock.data.quotes.map((quote) => quote.close * amount),
                borderColor: getRandomColor(),
                fill: false,
            };
        });

        return { labels, datasets };
    }

    function calculateGrowths(data, stockAssets) {
        const mediumTermStartIndex = Math.max(
            data[0].data.quotes.length - 90,
            0,
        );
        const longTermStartIndex = Math.max(
            data[0].data.quotes.length - 365,
            0,
        );

        const mediumTermGrowths = data.map((stock) => {
            const asset = stockAssets.find((asset: any) =>
                asset.ticker === stock.ticker
            );
            const amount = asset ? asset.amount : 1;
            const startPrice = stock.data.quotes[mediumTermStartIndex].close;
            const endPrice =
                stock.data.quotes[stock.data.quotes.length - 1].close;
            return ((endPrice - startPrice) / startPrice) * 100 * amount;
        });

        const longTermGrowths = data.map((stock) => {
            const asset = stockAssets.find((asset: any) =>
                asset.ticker === stock.ticker
            );
            const amount = asset ? asset.amount : 1;
            const startPrice = stock.data.quotes[longTermStartIndex].close;
            const endPrice =
                stock.data.quotes[stock.data.quotes.length - 1].close;
            return ((endPrice - startPrice) / startPrice) * 100 * amount;
        });

        setMediumTermGrowth(mediumTermGrowths.reduce((a, b) => a + b, 0));
        setLongTermGrowth(longTermGrowths.reduce((a, b) => a + b, 0));
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    if (isLoading) {
        return <p class="text-center p-4">Loading...</p>;
    }

    return (
        <div class="w-full h-[400px] relative">
            <Chart
                type="line"
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `$${context.parsed.toLocaleString()}`;
                                },
                            },
                        },
                    },
                }}
            />
            <div class="mt-4">
                <p>Medium Term Growth: {mediumTermGrowth?.toFixed(2)}%</p>
                <p>Long Term Growth: {longTermGrowth?.toFixed(2)}%</p>
            </div>
        </div>
    );
}
