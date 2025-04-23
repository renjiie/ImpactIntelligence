import React, { useState, useRef } from 'react';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} from "@aws-sdk/client-bedrock-runtime";

// AWS Configuration setup component
const AWSConfigSetup = ({ onConfigSaved }) => {
  const [awsConfig, setAwsConfig] = useState({
    region: '',
    accessKeyId: '',
    secretAccessKey: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAwsConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfigSaved(awsConfig);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">AWS Configuration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">AWS Region</label>
          <input
            type="text"
            name="region"
            value={awsConfig.region}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., us-east-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Access Key ID</label>
          <input
            type="text"
            name="accessKeyId"
            value={awsConfig.accessKeyId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Secret Access Key</label>
          <input
            type="password"
            name="secretAccessKey"
            value={awsConfig.secretAccessKey}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

// Main application component
const DocumentQAApp = () => {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [awsConfig, setAwsConfig] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  // Remove a file from the list
  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Save AWS configuration
  const handleConfigSaved = (config) => {
    setAwsConfig(config);
    setConfigSaved(true);
  };

  // Convert files to base64 for sending to Bedrock
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract base64 data without the data URL prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Ask question to Claude
  const askQuestion = async () => {
    if (files.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!configSaved || !awsConfig) {
      setError('Please configure AWS credentials first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Configure AWS SDK with the provided credentials
      const client = new BedrockRuntimeClient({
        region: awsConfig.region,
        credentials: {
          accessKeyId: awsConfig.accessKeyId,
          secretAccessKey: awsConfig.secretAccessKey
        }
      });

      // Process files to base64
      const fileAttachments = await Promise.all(
        files.map(async (file) => {
          const base64Data = await getBase64(file);
          return {
            type: file.type,
            name: file.name,
            data: base64Data
          };
        })
      );

      // Create request payload for Claude
      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: question
              },
              ...fileAttachments.map(attachment => ({
                type: "image",
                source: {
                  type: "base64",
                  media_type: attachment.type,
                  data: attachment.data
                }
              }))
            ]
          }
        ]
      };

      // Call Claude model via AWS Bedrock
      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // Use appropriate model ID
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(requestBody)
      });

      const response = await client.send(command);
      
      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const assistantResponse = responseBody.content[0].text;
      
      setAnswer(assistantResponse);
    } catch (err) {
      console.error("Error querying Claude:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Document Q&A with AWS Bedrock Claude</h1>
      
      {!configSaved && (
        <AWSConfigSetup onConfigSaved={handleConfigSaved} />
      )}

      {configSaved && (
        <>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                multiple
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Select Files
              </button>
            </div>

            {files.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Uploaded Files:</h3>
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index} className="mb-1 flex justify-between items-center">
                      <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="3"
              placeholder="Ask a question about your documents..."
            ></textarea>
            <button
              onClick={askQuestion}
              disabled={isLoading}
              className={`py-2 px-4 rounded ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? 'Processing...' : 'Ask Claude'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {answer && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Claude's Answer</h2>
              <div className="prose max-w-none">
                {answer.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentQAApp;