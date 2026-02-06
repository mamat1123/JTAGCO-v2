import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

interface TestResultFieldsProps {
  testResult: string;
  testResultReason: string;
  gotJob: string;
  gotJobReason: string;
  onTestResultChange: (value: string) => void;
  onTestResultReasonChange: (value: string) => void;
  onGotJobChange: (value: string) => void;
  onGotJobReasonChange: (value: string) => void;
  showValidation?: boolean;
}

export function TestResultFields({
  testResult,
  testResultReason,
  gotJob,
  gotJobReason,
  onTestResultChange,
  onTestResultReasonChange,
  onGotJobChange,
  onGotJobReasonChange,
  showValidation = false,
}: TestResultFieldsProps) {
  const isTestResultInvalid = showValidation && !testResult;
  const isTestResultReasonInvalid = showValidation && testResult === 'fail' && !testResultReason;
  const isGotJobInvalid = showValidation && testResult === 'pass' && !gotJob;
  const isGotJobReasonInvalid = showValidation && testResult === 'pass' && gotJob === 'no' && !gotJobReason;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>ผลเทส</Label>
        <RadioGroup
          value={testResult}
          onValueChange={onTestResultChange}
          className={`flex gap-4 ${isTestResultInvalid ? 'p-2 border border-destructive rounded-md' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pass" id="test_pass" />
            <Label htmlFor="test_pass" className="font-normal cursor-pointer">ผ่าน</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fail" id="test_fail" />
            <Label htmlFor="test_fail" className="font-normal cursor-pointer">ไม่ผ่าน</Label>
          </div>
        </RadioGroup>
        {isTestResultInvalid && (
          <p className="text-sm text-destructive">กรุณาเลือกผลเทส</p>
        )}
      </div>

      {testResult === "fail" && (
        <div className="space-y-2">
          <Label htmlFor="test_result_reason">เหตุผลที่ไม่ผ่าน</Label>
          <Textarea
            id="test_result_reason"
            value={testResultReason}
            onChange={(e) => onTestResultReasonChange(e.target.value)}
            placeholder="กรอกเหตุผลที่ไม่ผ่าน"
            className="min-h-[80px]"
            aria-invalid={isTestResultReasonInvalid}
          />
          {isTestResultReasonInvalid && (
            <p className="text-sm text-destructive">กรุณากรอกเหตุผลที่ไม่ผ่าน</p>
          )}
        </div>
      )}

      {testResult === "pass" && (
        <>
          <div className="space-y-2">
            <Label>ได้งาน</Label>
            <RadioGroup
              value={gotJob}
              onValueChange={onGotJobChange}
              className={`flex gap-4 ${isGotJobInvalid ? 'p-2 border border-destructive rounded-md' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="got_job_yes" />
                <Label htmlFor="got_job_yes" className="font-normal cursor-pointer">ได้</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="got_job_no" />
                <Label htmlFor="got_job_no" className="font-normal cursor-pointer">ไม่ได้</Label>
              </div>
            </RadioGroup>
            {isGotJobInvalid && (
              <p className="text-sm text-destructive">กรุณาเลือกว่าได้งานหรือไม่</p>
            )}
          </div>

          {gotJob === "no" && (
            <div className="space-y-2">
              <Label htmlFor="got_job_reason">เหตุผลที่ไม่ได้งาน</Label>
              <Textarea
                id="got_job_reason"
                value={gotJobReason}
                onChange={(e) => onGotJobReasonChange(e.target.value)}
                placeholder="กรอกเหตุผลที่ไม่ได้งาน"
                className="min-h-[80px]"
                aria-invalid={isGotJobReasonInvalid}
              />
              {isGotJobReasonInvalid && (
                <p className="text-sm text-destructive">กรุณากรอกเหตุผลที่ไม่ได้งาน</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
