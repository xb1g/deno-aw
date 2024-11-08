import { useEffect, useState } from "preact/hooks";
import Chart from "@/islands/Chart.tsx";

interface StockChartProps {
    tickers: string[];
}

export default function StockChart({ tickers }: StockChartProps) {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStockData() {
            try {
                const response = await fetch(
                    `/api/yf/chart?tickers=${tickers.join(",")}`,
                );
                const data = await response.json();
                const formattedData = formatChartData(data);
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStockData();
    }, [tickers]);

    function formatChartData(data) {
        const labels = data[0].data.quotes.map((quote) =>
            new Date(quote.date).toLocaleDateString()
        );

        const datasets = data.map((stock) => ({
            label: stock.ticker,
            data: stock.data.quotes.map((quote) => quote.close),
            borderColor: getRandomColor(),
            fill: false,
        }));

        return { labels, datasets };
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
        </div>
    );
}
