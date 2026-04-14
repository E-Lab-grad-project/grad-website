export default function SystemStatus() {
  return (
    <div className="bg-gray-800/80 rounded-2xl p-4 border border-gray-700">
      <h2 className="font-semibold mb-4">System Status</h2>

      <ul className="space-y-2 text-sm">
        <li>NLP Engine: <span className="text-green-400">Online</span></li>
        <li>Object Detection: <span className="text-yellow-400">Loading</span></li>
        <li>Arm 1: <span className="text-green-400">Idle</span></li>
        <li>Arm 2: <span className="text-red-400">Disconnected</span></li>
      </ul>
    </div>
  );
}
