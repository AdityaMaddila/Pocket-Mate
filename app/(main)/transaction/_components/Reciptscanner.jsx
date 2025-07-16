"use client";
import { scanReceipt } from '@/actions/transaction';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';

const Receiptscanner = ({onScanComplete}) => {
    const fileInputRef = useRef();
    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: scannedData,
    } = useFetch(scanReceipt);


    const handleReceiptScan=async (file)=>{
        if(file.size>5*1024*1024){
            toast.error("File size too large (max:5mb)");
            return;
        }
        await scanReceiptFn(file);
    };
    
    useEffect(()=>{
        if(scannedData && !scanReceiptLoading){
            onScanComplete(scannedData);
            toast.success("Receipt scanned successfully");

        }
    },[scanReceiptLoading,scannedData]);


    return (
        <div className="w-full max-w-md mx-auto">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) handleReceiptScan(file);
                }}
            />
            <Button 
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-2">
                    {scanReceiptLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Scanning Receipt...</span>
                        </>
                    ) : (
                        <>
                            <Camera className="w-5 h-5" />
                            <span className="text-sm font-medium">Scan Receipt with AI</span>
                        </>
                    )}
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </Button>
        </div>
    )
}

export default Receiptscanner