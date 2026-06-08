import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { SearchX } from 'lucide-react'
import { Button } from './ui/button'

const NotFound = () => {
    return (
        <div className="flex min-h-[80vh] w-full items-center justify-center p-6">
            <Card className="w-full max-w-lg text-center shadow-lg border-gray-200">
                <CardHeader>
                    <div className="flex flex-col items-center gap-3">
                        <SearchX className="h-12 w-12 text-gray-500" />
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            صفحه پیدا نشد
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        متاسفانه صفحه‌ای که به دنبال آن بودید یافت نشد.
                    </p>

                    <div className="flex justify-center gap-3 pt-4">
                        <Button onClick={() => window.history.back()} variant="outline">
                            بازگشت
                        </Button>
                        <Button onClick={() => (window.location.href = "/")} variant="default">
                            صفحه اصلی
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>)
}

export default NotFound