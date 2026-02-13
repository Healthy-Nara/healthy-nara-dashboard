import React from 'react';

interface Caregiver {
  _id: { $oid: string };
  name: string;
  NRC: string;
  createdAt?: string | { $date: string };
  __v: number;
}

const caregiverData: Caregiver[] = [
  {
    "_id": { "$oid": "67a30b340a2935ea24bbda1f" },
    "name": "Phyu Lay Nwe",
    "NRC": "10/MDN(N)241701",
    "__v": 0,
    "createdAt": "2025-02-05T17:00:57.469+00:00"
  },
  {
    "_id": { "$oid": "67a31ef60a2935ea24bbda21" },
    "name": "မထက်ထက်",
    "NRC": "12/ဒလန(နိုင်)068611",
    "__v": 0,
    "createdAt": "2025-02-05T17:00:57.469+00:00"
  },
  {
    "_id": { "$oid": "681b3c0f9f679ef2467cc232" },
    "name": "Ma Phyo Phyo Khaing",
    "NRC": "11/Katala(n)004236",
    "createdAt": { "$date": "2025-05-07T03:24:54.197Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6832e7ca1b67f4cc33553c01" },
    "name": "မအင်ကြင်းခိုင်",
    "NRC": "8/MaLaNa(N)054625",
    "createdAt": { "$date": "2025-05-18T09:53:22.988Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "683308951b67f4cc33553c03" },
    "name": "Ma Zue Pyae Sone San",
    "NRC": "12/DaGaTa(N)065254",
    "createdAt": { "$date": "2025-05-18T09:53:22.988Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "683420361b67f4cc33553c66" },
    "name": "Kyu Kyu Mar",
    "NRC": "12/ကတန(နိုင်)၀၆၅၆၈၅",
    "createdAt": { "$date": "2025-05-18T09:53:22.988Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "683576cf1b67f4cc33553d36" },
    "name": "မေမြတ်နိုး",
    "NRC": "12/lathaya(N)082399",
    "createdAt": { "$date": "2025-05-18T09:53:22.988Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6835cb701b67f4cc33553e95" },
    "name": "မသက်ထားရွှေစင်",
    "NRC": "၁၂/ဒဂဆနိူင်၀၄၉၂၈၀",
    "createdAt": { "$date": "2025-05-18T09:53:22.988Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "684231264502deddbd3b620f" },
    "name": "Aye Myat Mon ",
    "NRC": "၁၂/မဘန(နိုင်)၂၂၅၇၆၆",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "684800f54502deddbd3b6222" },
    "name": "မဝေဝေဖြိုး",
    "NRC": "၁၄/ကပန(နိုင်)142197",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "684800f54502deddbd3b6224" },
    "name": "မဝေဝေဖြိုး",
    "NRC": "၁၄/ကပန(နိုင်)142197",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685016cc4502deddbd3b623a" },
    "name": "အိခွါညို",
    "NRC": "13/kalana N130601",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685016cc4502deddbd3b623c" },
    "name": "အိခွါညို",
    "NRC": "13/kalana N130601",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685016cc4502deddbd3b623e" },
    "name": "အိခွါညို",
    "NRC": "13/kalana N130601",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685016cc4502deddbd3b6240" },
    "name": "အိခွါညို",
    "NRC": "13/kalana N130601",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685927094502deddbd3b626a" },
    "name": "မနွယ်နွယ်လှိုင်",
    "NRC": "12/အစနနိုင်(193968)",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685a5f1f4502deddbd3b6288" },
    "name": "NawCalel ",
    "NRC": "၁၄/ဖပန(နိုင်)297128",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685b86f04502deddbd3b628a" },
    "name": "မစိုးကလျာမိုး",
    "NRC": "14/259792",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685bc4384502deddbd3b628c" },
    "name": "မဇင်မာသင်း",
    "NRC": "8/နမန(နိုင်)145860",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685cb9264502deddbd3b6299" },
    "name": "Nay Nay",
    "NRC": "246613",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "685cb9ee4502deddbd3b629b" },
    "name": "Ma Ei Ei Zar",
    "NRC": "12/Thakata(N)167665",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "686142024502deddbd3b62a4" },
    "name": "Khin Myat Noe Lwin",
    "NRC": "7/NTL (naing) 144866",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6862c1654502deddbd3b62a6" },
    "name": "Nwe Mar Soe",
    "NRC": "14/အ မ န (နိုင်) 214862",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6874dddd4502deddbd3b62ab" },
    "name": "ဟန်နီစိုး",
    "NRC": "၇/ညလပ(နိုင်)၂၅၄၉၇၀",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6874ddde4502deddbd3b62ad" },
    "name": "ဟန်နီစိုး",
    "NRC": "၇/ညလပ(နိုင်)၂၅၄၉၇၀",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6874de8d4502deddbd3b62af" },
    "name": "Han Ni Soe",
    "NRC": "7/Nya La Pa(N)254970",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "6874de8e4502deddbd3b62b1" },
    "name": "Han Ni Soe",
    "NRC": "7/Nya La Pa(N)254970",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "689217af4502deddbd3b6317" },
    "name": "မအိမ့်သဲဖြူ",
    "NRC": "၁၂/ဥကမ(နိုင်)၂၉၈၁၃၇",
    "createdAt": { "$date": "2025-06-03T03:20:56.346Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "68aae6c6a018aea366691d4d" },
    "name": "မသောင်းဆုမြတ်မွန်",
    "NRC": "141276",
    "createdAt": { "$date": "2025-08-13T11:12:00.746Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "68b0202fa018aea366691d65" },
    "name": "မချမ်းမြေ့ကျော်",
    "NRC": "၁၂/လသယ(နိုင်)၀၉၄၃၆၃",
    "createdAt": { "$date": "2025-08-13T11:12:00.746Z" },
    "__v": 0
  }
];

const TermsAndConditions: React.FC = () => {
  const formatDate = (date: string | { $date: string } | undefined) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    if (date.$date) {
      return new Date(date.$date).toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Welcome to HealthyNara. By using our services, you agree to comply with and be bound by the following terms and conditions.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Caregiver Services</h2>
          <p className="mb-4">
            Our platform connects families with qualified caregivers. All caregivers listed below have been verified and are part of our trusted network.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. User Responsibilities</h2>
          <p className="mb-4">
            Users must provide accurate information and treat all caregivers with respect and professionalism.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Privacy and Data Protection</h2>
          <p className="mb-4">
            We are committed to protecting your personal information and maintaining your privacy.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Service Fees</h2>
          <p className="mb-4">
            Service fees are clearly communicated before booking. No hidden charges will be applied.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified Caregivers</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NRC Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {caregiverData.map((caregiver, index) => (
                <tr key={caregiver._id.$oid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {caregiver.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {caregiver.NRC}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(caregiver.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Total Caregivers: {caregiverData.length}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
