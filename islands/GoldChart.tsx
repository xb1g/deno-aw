import { useEffect, useState } from "preact/hooks";
import Chart from "@/islands/Chart.tsx";

interface GoldChartProps {
    endpoint: string;
}

export default function GoldChart({ endpoint }: GoldChartProps) {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchGoldData() {
            try {
                const response = await fetch(endpoint);
                const assets = await response.json();
                const goldAssets = assets.filter((asset: any) =>
                    asset.type === "gold"
                );

                if (goldAssets.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const chartResponse = await fetch(
                    `/api/yf/chart?tickers=GOLD`,
                );
                const data = await chartResponse.json();
                const formattedData = formatChartData(data, goldAssets);
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching gold data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGoldData();
    }, [endpoint]);

    function formatChartData(data, goldAssets) {
        const labels = data[0].data.quotes.map((quote) =>
            new Date(quote.date).toLocaleDateString()
        );

        const datasets = goldAssets.map((asset: any) => ({
            label: "Gold",
            data: data[0].data.quotes.map((quote) =>
                quote.close * asset.quantity
            ),
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
