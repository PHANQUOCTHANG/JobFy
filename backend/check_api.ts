import { getSavedJobs } from '../frontend/src/features/jobs/api/jobs.api';

// I cannot run this because frontend relies on browser APIs and absolute paths like '@/lib/api'.
// Instead, I'll simulate the axios response processing logic.

function processResponse(response: any) {
    const rawData = response.data?.data || response.data || [];
    
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData) && rawData.data) {
      return {
        data: Array.isArray(rawData.data) ? rawData.data : [],
        meta: rawData.meta || {},
      };
    }
    
    if (Array.isArray(rawData)) {
      return {
        data: rawData,
        meta: response.data?.meta || {},
      };
    }
    
    return { data: [], meta: {} };
}

const mockResponse = {
  data: {
    success: true,
    message: "Success",
    data: {
      data: [
        { id: 1, job: { title: "Test" } }
      ],
      meta: { total: 1 }
    }
  }
};

const result = processResponse(mockResponse);
console.log("Processed result:", JSON.stringify(result, null, 2));
