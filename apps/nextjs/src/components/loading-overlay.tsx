import React from 'react';
import * as Icons from "@saasfly/ui/icons";

interface LoadingOverlayProps {
    isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
    )
}

export default LoadingOverlay;