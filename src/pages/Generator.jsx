import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import Preview from '../components/Preview';
import { processSpreadsheet } from '../utils/spreadsheet';
import { useToast } from '../components/ui/useToast';

export default function Generator() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const processedData = await processSpreadsheet(file);
      setItems(processedData);
      toast({
        title: "Success",
        description: `Processed ${processedData.length} items successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Upload Inventory Data
        </h1>
        <FileUpload onUpload={handleFileUpload} loading={loading} />
      </motion.div>

      {items.length > 0 && (
        <Preview items={items} />
      )}
    </div>
  );
}