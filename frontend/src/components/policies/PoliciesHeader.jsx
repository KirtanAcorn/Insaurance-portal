import { FileText, Plus } from "lucide-react"

const PoliciesHeader = () => {
  return (
    <>
        <div className={`mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-black">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Policy Management</h2>
                <p className="text-purple-100">Advanced insurance policy management system</p>
              </div>
            </div>
          </div>
    </div>
    </>
  )
}

export default PoliciesHeader