import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import type { User } from "@/utils/db.ts";
import GitHubAvatarImg from "@/components/GitHubAvatarImg.tsx";
import { fetchValues } from "@/utils/http.ts";
import { PremiumBadge } from "@/components/PremiumBadge.tsx";
import ArrowLeft from "tabler_icons_tsx/arrow-left.tsx";
import ArrowRight from "tabler_icons_tsx/arrow-right.tsx";
import { Asset } from "@/utils/db.ts";

const AssetForm = () => {
  const [page, setPage] = useState(1);
  const [assetType, setAssetType] = useState("");
  const [formData, setFormData] = useState<Asset>({
    // Stock fields
    id: "",
    userLogin: "",
    type: "",
    createdAt: new Date(),

    ticker: "",
    amount: 0,
    buyPrice: 0,
    currency: "",
    fundName: "",
    fundType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", { assetType, ...formData });
  };

  const renderFirstPage = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">Select Asset Type</h2>
      <div className="grid grid-cols-2 gap-4">
        {["Stock", "Gold", "Cash", "Fund"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setAssetType(type.toLowerCase());
              setPage(2);
            }}
            className={`p-4 rounded-lg border-2 ${
              assetType === type.toLowerCase()
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/50"
            } transition-colors`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSecondPage = () => {
    const inputClass = "input-styles w-full mt-2 p-2 border rounded-lg";
    const labelClass = "block text-sm font-medium leading-6 text-gray-900";

    switch (assetType) {
      case "stock":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Stock Details</h2>
            <div>
              <label htmlFor="ticker" className={labelClass}>
                Stock Ticker
              </label>
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="AAPL"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className={labelClass}>
                Number of Shares
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="100"
                required
              />
            </div>
            <div>
              <label htmlFor="buyPrice" className={labelClass}>
                Purchase Price ($)
              </label>
              <input
                type="number"
                id="buyPrice"
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="150.00"
                step="0.01"
                required
              />
            </div>
          </div>
        );

      case "gold":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Gold Details</h2>
            <div>
              <label htmlFor="date" className={labelClass}>Purchase Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className={labelClass}>
                Amount (grams)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="100"
                step="0.01"
                required
              />
            </div>
          </div>
        );

      case "cash":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Cash Details</h2>
            <div>
              <label htmlFor="amount" className={labelClass}>
                Amount (THB)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="10000"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="currency" className={labelClass}>Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={inputClass}
                required
                disabled
              >
                <option value="THB">THB</option>
              </select>
            </div>
          </div>
        );

      case "fund":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Fund Details</h2>
            <div>
              <label htmlFor="fundName" className={labelClass}>Fund Name</label>
              <input
                type="text"
                id="fundName"
                name="fundName"
                value={formData.fundName}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Vanguard S&P 500 ETF"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className={labelClass}>
                Investment Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="10000"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="fundType" className={labelClass}>Fund Type</label>
              <select
                id="fundType"
                name="fundType"
                value={formData.fundType}
                onChange={handleInputChange}
                className={inputClass}
                required
              >
                <option value="">Select fund type</option>
                <option value="ETF">ETF</option>
                <option value="Mutual Fund">Mutual Fund</option>
                <option value="Index Fund">Index Fund</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form method="post" className="max-w-md mx-auto p-6">
      {page === 1 ? renderFirstPage() : renderSecondPage()}
      <input type="hidden" name="assetType" value={assetType} />

      <div className="flex justify-between mt-8">
        {page === 2 && (
          <button
            type="button"
            onClick={() => setPage(1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}

        {page === 2 && (
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90"
          >
            Submit
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </form>
  );
};

export default AssetForm;
