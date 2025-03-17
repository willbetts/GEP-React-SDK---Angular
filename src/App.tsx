import React, { useEffect } from 'react';
import { GustoApiProvider } from "@gusto/embedded-react-sdk"; // Import only what you need
import "@gusto/embedded-react-sdk/style.css";
import { EmployeeOnboardingFlow } from '@gusto/embedded-react-sdk';


// Define the dictionary for translations
const dictionary = {
  en: {
    'Employee.EmployeeList': {
      title: 'Please provide your payment information',
      submitCta: 'Next step',
    },
  },
};


const backendUrl ="/"

function App({ backendUrl }: { backendUrl: string }) {
  const companyId = 'e9a35847-36c8-4086-bb74-2296bb17ca50';

  const handleEvent = async (evt: any, data: any) => {
    console.log(`Event from SDK: `, evt, data);
  };

  return (
    <GustoApiProvider
      config={{
        baseUrl: `${backendUrl}/`, 
      }}
      dictionary={dictionary}
    >
      <EmployeeOnboardingFlow companyId={companyId} onEvent={handleEvent} />
    </GustoApiProvider>
  );
}

export default App;
