const os = require('node:os')
const osu = require('node-os-utils');

/**
 * Calculates the CPU usage of the own process in percentage
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @returns {Promise<number>} cpu usage in percentage
 */
async function getProcessCpuUsage(timeSpan) {
  const startUsage = process.cpuUsage();
  return new Promise((resolve) => {
    setTimeout(() => {
      const usage = process.cpuUsage(startUsage);
      const percent = ((usage.system + usage.user) / (timeSpan * 1000)) * 100;
      resolve(percent);
    }, timeSpan);
  });
}

/**
 * Provides some useful information about OS/system
 * 
 * @returns {Promise<object>} OS stats
 */
async function getOsStats() {
  const osCmd = osu.osCmd;
  const [name, type, arch, platform, ip, hostname, uptime, loadavg, openFiles, cpus, topCpu, topMem, vmstats] = await Promise.all([
    osu.os.oos(),
    osu.os.type(), // same as node:os.time()
    osu.os.arch(), // same as node:os.arch()
    osu.os.platform(), // same as node:os.platform()
    osu.os.ip(),
    osu.os.hostname(), // same as node:os.hostname()
    osu.os.uptime(), // same as node:os.uptime()
    osu.openfiles.openFd(),
    os.loadavg(),
    os.cpus(),
    osu.osCmd.topCpu(),
    osu.osCmd.topMem(),
    osu.osCmd.vmstats(),
  ]);

  return {name, type, arch, platform, ip, hostname, uptime, loadavg, openFiles, cpus, topCpu, topMem, vmstats};
}

/**
 * Provides some useful information about CPU
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @param {number} avgTime Time in minutes (1, 5 or 15)
 * @returns {Promise<object>} CPU stats
 */
async function getCpuStats(timeSpan, avgTime) {
  const cpu = osu.cpu;
  const proc = osu.proc;
  const [model, count, loadavg, loadavgTime, average, usagePercent, freePercent, totalProcesses, zombieProcesses] = await Promise.all([
    cpu.model(),
    cpu.count(),
    cpu.loadavg(), // same as node:os.loadavg()
    cpu.loadavgTime(avgTime),
    cpu.average(),
    cpu.usage(timeSpan),
    cpu.free(timeSpan),
    proc.totalProcesses(),
    proc.zombieProcesses(),
  ]);

  return {model, count, loadavg, loadavgTime, average, usagePercent, freePercent, totalProcesses, zombieProcesses};
}

/**
 * Provides some useful information about memory
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @returns {Promise<object>} Memory stats
 */
async function getMemoryStats() {
  const mem = osu.mem;
  const [total, free, used, info] = await Promise.all([
    mem.totalMem(), // same as node:os.totalmem()
    mem.free(), // same as node:os.freemem()
    mem.used(),
    mem.info(),
  ]);

  return {total, free, used, info};
}

/**
 * Provides some useful information about network
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @returns {Promise<object>} network stats
 */
async function getNetworkStats(timeSpan) {
  const net = osu.netstat;
  const [stats, inOut] = await Promise.all([
    net.stats(),
    net.inOut(timeSpan),
  ]);

  return {stats, inOut};
}

/**
 * Provides some useful information about node process
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @returns {Promise<object>} Node process stats
 */
async function getProcessStats(timeSpan) {
  const [uptime, cpuUsage] = await Promise.all([
    process.uptime(),
    getProcessCpuUsage(timeSpan),
  ]);

  return {uptime, cpuUsage};
}

/**
 * Provides some useful information about OS, system, CPU, memory, netwrok and node process
 * 
 * @param {number} timeSpan Time period in milliseconds
 * @returns {Promise<object>} All stats
 */
async function getStats(timeSpan) {
  const [os, cpu, mem, net, proc] = await Promise.all([
    getOsStats(),
    getCpuStats(timeSpan, 5),
    getMemoryStats(),
    getNetworkStats(timeSpan),
    getProcessStats(timeSpan),
  ])
  
  return {os, cpu, mem, net, proc};
}

module.exports = {
  getStats,
  getOsStats,
  getCpuStats,
  getMemoryStats,
  getNetworkStats,
  getProcessStats,
}
