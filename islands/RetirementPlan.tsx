import { useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { ulid } from "$std/ulid/mod.ts";

interface RetirementPlan {
    id: string;
    userLogin: string;
    retirementAge: number;
    currentSavings: number;
    monthlyContribution: number;
    expectedReturnRate: number;
}

export default function RetirementPlan({ userLogin }: { userLogin: string }) {
    const [formData, setFormData] = useState({
        retirementAge: "",
        currentSavings: "",
        monthlyContribution: "",
        expectedReturnRate: "",
    });
    const isLoadingSig = useSignal(false);

    const handleInputChange = (e: Event) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        isLoadingSig.value = true;

        const retirementPlan: RetirementPlan = {
            id: ulid(),
            userLogin,
            retirementAge: Number(formData.retirementAge),
            currentSavings: Number(formData.currentSavings),
            monthlyContribution: Number(formData.monthlyContribution),
            expectedReturnRate: Number(formData.expectedReturnRate),
        };

        try {
            const response = await fetch("/api/retirement-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(retirementPlan),
            });

            if (!response.ok) {
                throw new Error("Failed to save retirement plan");
            }

            alert("Retirement plan saved successfully!");
        } catch (error) {
            console.error(error.message);
            alert("Failed to save retirement plan");
        } finally {
            isLoadingSig.value = false;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold mb-6">Retirement Plan</h2>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="retirementAge"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Retirement Age
                    </label>
                    <input
                        type="number"
                        id="retirementAge"
                        name="retirementAge"
                        value={formData.retirementAge}
                        onChange={handleInputChange}
                        className="input-styles w-full mt-2 p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="currentSavings"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Current Savings
                    </label>
                    <input
                        type="number"
                        id="currentSavings"
                        name="currentSavings"
                        value={formData.currentSavings}
                        onChange={handleInputChange}
                        className="input-styles w-full mt-2 p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="monthlyContribution"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Monthly Contribution
                    </label>
                    <input
                        type="number"
                        id="monthlyContribution"
                        name="monthlyContribution"
                        value={formData.monthlyContribution}
                        onChange={handleInputChange}
                        className="input-styles w-full mt-2 p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="expectedReturnRate"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Expected Return Rate (%)
                    </label>
                    <input
                        type="number"
                        id="expectedReturnRate"
                        name="expectedReturnRate"
                        value={formData.expectedReturnRate}
                        onChange={handleInputChange}
                        className="input-styles w-full mt-2 p-2 border rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90"
                    disabled={isLoadingSig.value}
                >
                    {isLoadingSig.value ? "Saving..." : "Submit"}
                </button>
            </div>
        </form>
    );
}
